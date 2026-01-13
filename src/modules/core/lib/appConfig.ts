import { createServerOnlyFn } from '@tanstack/react-start';

const loadEnvironmentVariable = (key: string) => {
  const envVar = import.meta.env[key];
  if (!envVar) {
    throw new Error(`Must configure ${key} environment variable.`);
  }

  return envVar;
};

const loadServerEnvironmentVariable = (key: string) => {
  const envVar = process.env[key];

  if (!envVar) {
    throw new Error(`Must configure ${key} environment variable.`);
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
};

export const serverAppConfig = createServerOnlyFn(() => ({
  anthropic: {
    apiKey: loadServerEnvironmentVariable('ANTHROPIC_API_KEY'),
  },
}));
