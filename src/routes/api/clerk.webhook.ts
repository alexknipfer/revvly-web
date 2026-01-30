import { createFileRoute } from '@tanstack/react-router';
import { verifyWebhook } from '@clerk/backend/webhooks';
import { ConvexHttpClient } from 'convex/browser';

import { appConfig, serverAppConfig } from '@/lib/appConfig';
import { tryCatch } from '@/lib/utils';
import { api } from 'convex/_generated/api';
import { captureException } from '@/lib/logger';

export const Route = createFileRoute('/api/clerk/webhook')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const clerkWebhookSigningKey =
          serverAppConfig().clerk.webhookSigningSecret;

        const [verifyWebhookError, event] = await tryCatch(
          verifyWebhook(request, {
            signingSecret: clerkWebhookSigningKey,
          }),
        );
        if (verifyWebhookError) {
          captureException(verifyWebhookError);

          return Response.json(
            { success: false, error: verifyWebhookError.message },
            { status: 400 },
          );
        }

        const convexClient = new ConvexHttpClient(appConfig.convex.url);

        switch (event.type) {
          case 'user.created':
          case 'user.updated': {
            const [userUpsertError] = await tryCatch(
              convexClient.mutation(api.users.upsertFromClerk, {
                firstName: event.data.first_name,
                lastName: event.data.last_name,
                imageUrl: event.data.image_url,
                externalId: event.data.id,
                clerkWebhookSigningKey,
              }),
            );

            if (userUpsertError) {
              captureException(userUpsertError);

              return Response.json(
                { success: false, error: userUpsertError.message },
                { status: 400 },
              );
            }

            break;
          }
          case 'user.deleted': {
            if (event.data.id) {
              const [userDeleteError] = await tryCatch(
                convexClient.mutation(api.users.deleteFromClerk, {
                  clerkUserId: event.data.id,
                  clerkWebhookSigningKey,
                }),
              );

              if (userDeleteError) {
                captureException(userDeleteError);

                return Response.json(
                  { success: false, error: userDeleteError.message },
                  { status: 404 },
                );
              }
            }

            break;
          }
        }

        return new Response(null, { status: 200 });
      },
    },
  },
});
