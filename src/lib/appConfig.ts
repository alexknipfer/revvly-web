import { createServerOnlyFn } from '@tanstack/react-start';

import { captureException } from '@/lib/logger';

const loadEnvironmentVariable = (key: string) => {
  const envVar = import.meta.env[key];
  if (!envVar) {
    const error = new Error(`Must configure ${key} environment variable.`);
    captureException(error);
    throw error;
  }

  return envVar;
};

const loadServerEnvironmentVariable = (key: string) => {
  const envVar = process.env[key];

  if (!envVar) {
    const error = new Error(`Must configure ${key} environment variable.`);
    captureException(error);
    throw error;
  }

  return envVar;
};

export const appConfig = {
  convex: {
    url: loadEnvironmentVariable('VITE_CONVEX_URL'),
  },
  googleMaps: {
    apiKey: loadEnvironmentVariable('VITE_GOOGLE_MAPS_API_KEY'),
  },
  sentry: {
    dsn: loadEnvironmentVariable('VITE_SENTRY_DSN'),
    environment: loadEnvironmentVariable('VITE_SENTRY_ENVIRONMENT'),
  },
};

export const serverAppConfig = createServerOnlyFn(() => ({
  app: {
    url: loadServerEnvironmentVariable('VERCEL_URL'),
  },
  anthropic: {
    apiKey: loadServerEnvironmentVariable('ANTHROPIC_API_KEY'),
  },
  clerk: {
    webhookSigningSecret: loadServerEnvironmentVariable(
      'CLERK_WEBHOOK_SIGNING_SECRET',
    ),
  },
  resend: {
    apiKey: loadServerEnvironmentVariable('RESEND_API_KEY'),
  },
}));
