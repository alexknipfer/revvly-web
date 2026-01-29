import { createFileRoute } from '@tanstack/react-router';
import { verifyWebhook } from '@clerk/backend/webhooks';

import { appConfig, serverAppConfig } from '@/lib/appConfig';
import { ConvexHttpClient } from 'convex/browser';
import { tryCatch } from '@/lib/utils';
import { api } from 'convex/_generated/api';
import { captureException } from '@/lib/logger';

export const Route = createFileRoute('/api/clerk/webhook')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const event = await verifyWebhook(request, {
          signingSecret: serverAppConfig().clerk.webhookSigningSecret,
        });

        const convexClient = new ConvexHttpClient(appConfig.convex.url);

        switch (event.type) {
          case 'user.created':
          case 'user.updated': {
            const [userUpsertError] = await tryCatch(
              convexClient.mutation(api.users.upsertFromClerk, {
                firstName: event.data.first_name,
                lastName: event.data.last_name,
                externalId: event.data.id,
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
