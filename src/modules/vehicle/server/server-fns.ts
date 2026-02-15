import { createServerFn } from '@tanstack/react-start';
import ky from 'ky';
import { Resend } from 'resend';
import { auth } from '@clerk/tanstack-react-start/server';

import { api } from 'convex/_generated/api';
import { Id } from 'convex/_generated/dataModel';
import { tryCatch } from '@/lib/utils';
import { getAuthConvexClient } from '@/lib/auth';
import { captureException } from '@/lib/logger';
import { appendSentryUser } from '@/middleware/append-sentry-user';
import z from 'zod';
import { ConvexError } from 'convex/values';
import { serverAppConfig } from '@/lib/appConfig';

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const resend = new Resend(serverAppConfig().resend.apiKey);

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

const shareVehicleInputSchema = z.object({
  vehicleId: z.string().min(1),
  recipientEmail: z.email(),
});

export const createShareVehicleServerFn = createServerFn({
  method: 'POST',
})
  .middleware([appendSentryUser])
  .inputValidator(shareVehicleInputSchema)
  .handler(async ({ data }) => {
    const { vehicleId, recipientEmail } = data;
    const { userId, isAuthenticated } = await auth();

    if (!isAuthenticated) {
      throw new Error('Not Authorized');
    }

    const [convexClientError, convexClient] = await tryCatch(
      getAuthConvexClient(),
    );

    if (convexClientError) {
      captureException(convexClientError);
      throw new Error('Failed to get convex client');
    }

    const [userError, user] = await tryCatch(
      convexClient.query(api.users.getById, { clerkUserId: userId }),
    );

    if (userError || !user) {
      captureException(userError);
      throw new Error('Not Authorized');
    }

    const [vehicleError, vehicle] = await tryCatch(
      convexClient.query(api.vehicles.getById, {
        id: vehicleId as Id<'vehicles'>,
      }),
    );

    if (vehicleError || !vehicle) {
      captureException(vehicleError);
      throw new Error('Vehicle not found');
    }

    const [createShareError] = await tryCatch(
      convexClient.mutation(api.vehicleShares.create, {
        vehicleId,
        recipientEmail,
      }),
    );

    if (createShareError) {
      if (createShareError instanceof ConvexError) {
        if (createShareError.data.code === 'VEHICLE_ALREADY_SHARED_WITH_USER') {
          throw new Error('Vehicle already shared with this user');
        }
      } else {
        captureException(createShareError);
        throw new Error('Failed to create vehicle share');
      }
    }

    const [recipientUserError, recipientUser] = await tryCatch(
      convexClient.query(api.users.getByEmail, { email: recipientEmail }),
    );

    if (recipientUserError) {
      captureException(recipientUserError);
      throw new Error('Failed to create vehicle share');
    }

    const shareSenderName = user.firstName
      ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}`
      : user.primaryEmailAddress;

    const recipientName = recipientUser
      ? recipientUser.firstName
        ? `${recipientUser.firstName}${recipientUser.lastName ? ` ${recipientUser.lastName}` : ''}`
        : recipientEmail
      : recipientEmail;

    const vehicleDisplay = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;

    await resend.emails.send({
      to: recipientEmail,
      template: {
        id: 'share-vehicle-basic',
        variables: {
          ACCEPT_INVITATION_LINK: 'https://alexknipfer.com',
          RECIPIENT: recipientName,
          SHARE_SENDER: shareSenderName,
          VEHICLE: vehicleDisplay,
        },
      },
    });

    return {
      message:
        'If a user with this email address has an account, they will receive an email with a link to accept the share.',
    };
  });
