import ky from 'ky';

import { appConfig } from '@/modules/core/lib/appConfig';

export const googlePlacesApiClient = ky.create({
  prefixUrl: 'https://places.googleapis.com/v1/places',
  headers: {
    'X-Goog-Api-Key': appConfig.googleMaps.apiKey,
  },
});

export const vpicApiClient = ky.create({
  prefixUrl: 'https://vpic.nhtsa.dot.gov/api',
  searchParams: {
    format: 'json',
  },
});
