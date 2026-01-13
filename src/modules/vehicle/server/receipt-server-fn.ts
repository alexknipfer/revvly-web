import { createServerFn } from '@tanstack/react-start';
import sharp from 'sharp';

// import { chat } from '@tanstack/ai';
import z from 'zod';

// import { anthropicSonnetAdapter } from '@/modules/core/lib/anthropic';
import { fuelTypeSchema } from '@/modules/core/types/vehicles';
import { logger } from '@/modules/core/lib/logger';
import { tryCatch } from '@/modules/core/lib/utils';

const ReceiptOutputSchema = z.object({
  error: z.string().optional(),
  gasStationNameWithAddress: z.string().optional(),
  totalGallons: z.number().optional(),
  costPerGallon: z.number().optional(),
  typeOfFuel: fuelTypeSchema.optional(),
});

type ReceiptOutput = z.infer<typeof ReceiptOutputSchema>;

const MAX_FILE_SIZE = 8 * 1024 * 1024;

export const uploadFuelEntryReceiptServerFn = createServerFn({
  method: 'POST',
}).handler(async ({ data }) => {
  // const { image } = data;
  console.log('data', data);

  // const [arrayBufferError, arrayBuffer] = await tryCatch(image.arrayBuffer());
  // logger.debug('Received receipt image array buffer');

  // if (arrayBufferError) {
  //   logger.error('Failed to get receipt image array buffer', {
  //     error: arrayBufferError,
  //   });
  //   throw new Error('Failed to upload fuel entry receipt');
  // }

  // const buffer = Buffer.from(arrayBuffer);
  // logger.debug('Converted receipt image array buffer to buffer');

  // const [optimizeError, optimizedBuffer] = await tryCatch(
  //   sharp(buffer)
  //     .resize(1024, 1024, {
  //       fit: 'inside',
  //       withoutEnlargement: true,
  //     })
  //     .jpeg({
  //       quality: 90,
  //       mozjpeg: true,
  //     })
  //     .toBuffer(),
  // );
  // logger.debug('Optimized receipt image');

  // if (optimizeError) {
  //   logger.error('Failed to optimize receipt image: ', {
  //     error: optimizeError,
  //   });
  //   throw new Error('Failed to extract fuel entry details from receipt');
  // }

  // const [error, receiptOutput] = await tryCatch<ReceiptOutput>(
  //   chat({
  //     adapter: anthropicSonnetAdapter(),
  //     messages: [
  //       {
  //         role: 'user',
  //         content: [
  //           {
  //             type: 'text',
  //             content: `
  //               You are an expert at extracting fuel entry details from receipts.
  //               You will be given an image of a receipt and you will need to extract the gas station name with address, total gallons, cost per gallon, type of fuel.
  //               If you are only able to extract some of the details, only return the details you are able to extract.
  //               The gas station name with address should be in the format of {name - address}. If you are not able to extract the address, only return the name.
  //               If you are only able to get an address, don't return a gas station.
  //             `,
  //           },
  //           {
  //             type: 'image',
  //             source: {
  //               type: 'data',
  //               value: optimizedBuffer.toString('base64'),
  //             },
  //           },
  //         ],
  //       },
  //     ],
  //     outputSchema: ReceiptOutputSchema,
  //   }),
  // );

  // if (error) {
  //   logger.error('Failed to extract fuel entry details from receipt: ', {
  //     error,
  //   });
  //   throw new Error('Failed to extract fuel entry details from receipt');
  // }

  return {
    error: 'Successfully ran function',
  };
});
