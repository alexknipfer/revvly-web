import { createServerFn } from '@tanstack/react-start';
import ky from 'ky';
import sharp from 'sharp';
import { chat } from '@tanstack/ai';
import z from 'zod';

import { api } from 'convex/_generated/api';
import { Id } from 'convex/_generated/dataModel';
import { tryCatch } from '@/modules/core/lib/utils';
import { getAuthConvexClient } from '@/modules/core/lib/auth';
import { anthropicHaikuAdapter } from '@/modules/core/lib/anthropic';
import { fuelTypeSchema } from '@/modules/core/types/vehicles';

const MAX_FILE_SIZE = 8 * 1024 * 1024;

export const uploadVehicleImageServerFn = createServerFn({
  method: 'POST',
})
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
      console.error('Failed to get convex client: ', convexClientError);
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
      console.error('Failed to optimize image: ', optimizeError);
      throw new Error('Failed to upload image');
    }

    const [uploadUrlError, uploadUrl] = await tryCatch(
      convexClient.mutation(api.storage.generateUploadUrl),
    );

    if (uploadUrlError) {
      console.error('Failed to generate upload url: ', uploadUrlError);
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
      console.error('Failed to upload image: ', uploadError);
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
      console.error('Failed to update vehicle: ', updateError);
      throw new Error('Failed to update vehicle with image');
    }

    return { success: true, storageId: uploadResult.storageId };
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
      image,
    };
  })
  .handler(async ({ data }) => {
    const { image } = data;

    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const [optimizeError, optimizedBuffer] = await tryCatch(
      sharp(buffer)
        .resize(1024, 1024, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({
          quality: 90,
          mozjpeg: true,
        })
        .toBuffer(),
    );

    if (optimizeError) {
      console.error('Failed to optimize image: ', optimizeError);
      throw new Error('Failed to extract fuel entry details from receipt');
    }

    const [error, receiptOutput] = await tryCatch<ReceiptOutput>(
      chat({
        adapter: anthropicHaikuAdapter(),
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                content:
                  'Extract the gas station name with address in the format of {name - address}, total gallons, cost per gallon, type of fuel from the image of a receipt. If the image is not a receipt or you cannot parse any of these details supply a value for error.',
              },
              {
                type: 'image',
                source: {
                  type: 'data',
                  value: optimizedBuffer.toString('base64'),
                },
              },
            ],
          },
        ],
        outputSchema: ReceiptOutputSchema,
      }),
    );

    if (error) {
      console.error(
        'Failed to extract fuel entry details from receipt: ',
        error,
      );
      throw new Error('Failed to extract fuel entry details from receipt');
    }

    return receiptOutput;
  });
