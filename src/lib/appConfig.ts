const loadEnvironmentVariable = (key: string) => {
  const envVar = import.meta.env[key];
  if (!envVar) {
    throw new Error(`Must configure ${key} environment variable.`);
  }

  return envVar;
};

export const appConfig = {
  convex: {
    url: loadEnvironmentVariable('VITE_CONVEX_URL'),
  },
  mapbox: {
    baseUrl: loadEnvironmentVariable('VITE_MAPBOX_BASE_URL'),
    accessToken: loadEnvironmentVariable('VITE_MAPBOX_ACCESS_TOKEN'),
  },
};
