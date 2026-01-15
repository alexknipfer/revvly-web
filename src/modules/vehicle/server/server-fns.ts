import { createServerFn } from '@tanstack/react-start';
import ky from 'ky';
import sharp from 'sharp';
import { chat } from '@tanstack/ai';
import z from 'zod';

import { api } from 'convex/_generated/api';
import { Id } from 'convex/_generated/dataModel';
import { tryCatch } from '@/modules/core/lib/utils';
import { getAuthConvexClient } from '@/modules/core/lib/auth';
import { anthropicSonnetAdapter } from '@/modules/core/lib/anthropic';
import { fuelTypeSchema } from '@/modules/core/types/vehicles';
import { captureException } from '@/modules/core/lib/logger';
import { appendSentryUser } from '@/modules/core/server/middleware/append-sentry-user';

const MAX_FILE_SIZE = 8 * 1024 * 1024;

export const uploadVehicleImageServerFn = createServerFn({
  method: 'POST',
})
  .middleware([appendSentryUser])
  .inputValidator((data) => {
    if (!(data instanceof FormData)) {
      throw new Error('Expected FormData');
    }

    const image = data.get('image');

    if (!(image instanceof File) || !image.type.startsWith('image/')) {
      throw new Error('Expected image file');
    }

    if (image.size > MAX_FILE_SIZE) {
      throw new Error('Image file size must be no larger than 5MB');
    }

    return {
      vehicleId: data.get('vehicleId')?.toString() || '',
      image,
    };
  })
  .handler(async ({ data }) => {
    const { vehicleId, image } = data;

    if (!vehicleId) {
      throw new Error('Vehicle ID is required');
    }

    const [convexClientError, convexClient] = await tryCatch(
      getAuthConvexClient(),
    );

    if (convexClientError) {
      captureException(convexClientError);
      throw new Error('Failed to get convex client');
    }

    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const [optimizeError, optimizedBuffer] = await tryCatch(
      sharp(buffer)
        .resize(1920, 1920, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({
          quality: 85,
          effort: 6,
        })
        .toBuffer(),
    );

    if (optimizeError) {
      captureException(optimizeError);
      throw new Error('Failed to upload image');
    }

    const [uploadUrlError, uploadUrl] = await tryCatch(
      convexClient.mutation(api.storage.generateUploadUrl),
    );

    if (uploadUrlError) {
      captureException(uploadUrlError);
      throw new Error('Failed to upload image');
    }

    const [uploadError, uploadResult] = await tryCatch(
      ky
        .post<{ storageId: Id<'_storage'> }>(uploadUrl, {
          headers: { 'Content-Type': 'image/webp' },
          body: new Uint8Array(optimizedBuffer),
        })
        .json(),
    );

    if (uploadError) {
      captureException(uploadError);
      throw new Error('Failed to upload image');
    }

    const [updateError] = await tryCatch(
      convexClient.mutation(api.vehicles.update, {
        id: vehicleId as Id<'vehicles'>,
        update: {
          imageStorageId: uploadResult.storageId,
        },
      }),
    );

    if (updateError) {
      captureException(updateError);
      throw new Error('Failed to update vehicle with image');
    }

    return { success: true, storageId: uploadResult.storageId };
  });

const UploadFuelEntryReceiptInputSchema = z.object({
  imageUrl: z.url(),
});

const ReceiptOutputSchema = z.object({
  error: z.string().optional(),
  gasStationNameWithAddress: z.string().optional(),
  totalGallons: z.number().optional(),
  costPerGallon: z.number().optional(),
  typeOfFuel: fuelTypeSchema.optional(),
});

type ReceiptOutput = z.infer<typeof ReceiptOutputSchema>;

export const uploadFuelEntryReceiptServerFn = createServerFn({
  method: 'POST',
})
  .middleware([appendSentryUser])
  .inputValidator(UploadFuelEntryReceiptInputSchema)
  .handler(async ({ data }) => {
    const { imageUrl } = data;

    const [error, receiptOutput] = await tryCatch<ReceiptOutput>(
      chat({
        adapter: anthropicSonnetAdapter(),
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                content: `
                  You are an expert at extracting fuel entry details from receipts.
                  You will be given an image of a receipt and you will need to extract the gas station name with address, total gallons, cost per gallon, type of fuel.
                  If you are only able to extract some of the details, only return the details you are able to extract.
                  The gas station name with address should be in the format of {name - address}. If you are not able to extract the address, only return the name.
                  If you are only able to get an address, don't return a gas station.
                `,
              },
              {
                type: 'image',
                source: {
                  type: 'url',
                  value: imageUrl,
                },
              },
            ],
          },
        ],
        outputSchema: ReceiptOutputSchema,
      }),
    );

    if (error) {
      captureException(error);
      throw new Error('Failed to extract fuel entry details from receipt');
    }

    return receiptOutput;
  });
