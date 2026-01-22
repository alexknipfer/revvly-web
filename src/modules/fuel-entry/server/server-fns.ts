import { chat } from '@tanstack/ai';
import z from 'zod';
import { createServerFn } from '@tanstack/react-start';

import { anthropicSonnetAdapter } from '@/lib/anthropic';
import { fuelTypeSchema } from '@/types/fuel-entry';
import { appendSentryUser } from '@/middleware/append-sentry-user';
import { tryCatch } from '@/lib/utils';
import { captureException } from '@/lib/logger';

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
