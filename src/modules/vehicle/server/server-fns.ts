import { createServerFn } from '@tanstack/react-start';
import ky from 'ky';

import { api } from 'convex/_generated/api';
import { Id } from 'convex/_generated/dataModel';
import { tryCatch } from '@/lib/utils';
import { getAuthConvexClient } from '@/lib/auth';
import { captureException } from '@/lib/logger';
import { appendSentryUser } from '@/middleware/append-sentry-user';

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
          headers: { 'Content-Type': image.type },
          body: new Uint8Array(arrayBuffer),
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
