import { createServerOnlyFn } from '@tanstack/react-start';
import ky from 'ky';

import { serverAppConfig } from '@/lib/appConfig';

export const googlePlacesApi = createServerOnlyFn(() =>
  ky.create({
    prefixUrl: 'https://places.googleapis.com/v1/places',
    headers: {
      'X-Goog-Api-Key': serverAppConfig().googleMaps.apiKey,
    },
  }),
);
