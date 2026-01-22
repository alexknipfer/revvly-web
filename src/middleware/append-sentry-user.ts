import * as Sentry from '@sentry/tanstackstart-react';
import { auth } from '@clerk/tanstack-react-start/server';
import { createMiddleware } from '@tanstack/react-start';

export const appendSentryUser = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const result = await auth();

    if (result.userId) {
      Sentry.setUser({
        id: result.userId,
      });
    }

    return next();
  },
);
