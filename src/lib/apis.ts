import ky from 'ky';

import { appConfig } from '@/lib/appConfig';

export const googlePlacesApiClient = ky.create({
  prefixUrl: 'https://places.googleapis.com/v1/places',
  headers: {
    'X-Goog-Api-Key': appConfig.googleMaps.apiKey,
  },
});
