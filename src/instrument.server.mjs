import * as Sentry from '@sentry/tanstackstart-react';
import process from 'node:process';

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  sendDefaultPii: true,
  enableLogs: true,
  environment: process.env.VITE_SENTRY_ENVIRONMENT,
  enabled: process.env.VITE_SENTRY_ENVIRONMENT !== 'local',
  beforeSend: (event, hint) => {
    if (process.env.VITE_SENTRY_ENVIRONMENT === 'local') {
      globalThis.console.error(
        hint.originalException || hint.syntheticException,
      );
      return null;
    }

    return event;
  },
});
