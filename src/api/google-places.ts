import ky from 'ky';

import { appConfig } from '@/lib/appConfig';
import { tryCatch } from '@/lib/utils';
import { GooglePlacesNearbyResponse } from '@/types/google';

const googlePlacesApiClient = ky.create({
  prefixUrl: 'https://places.googleapis.com/v1/places',
  headers: {
    'X-Goog-Api-Key': appConfig.googleMaps.apiKey,
  },
});

export async function searchNearbyGasStations(data: {
  latitude: number;
  longitude: number;
  limit?: number;
  radius?: number;
}) {
  const { latitude, longitude, limit = 10, radius = 5000 } = data;

  const [error, response] = await tryCatch(
    googlePlacesApiClient
      .post<GooglePlacesNearbyResponse>(':searchNearby', {
        headers: {
          'X-Goog-FieldMask':
            'places.id,places.displayName,places.location,places.formattedAddress',
        },
        json: {
          includedTypes: ['gas_station'],
          maxResultCount: limit,
          rankPreference: 'DISTANCE',
          locationRestriction: {
            circle: {
              center: {
                latitude,
                longitude,
              },
              radius,
            },
          },
        },
      })
      .json(),
  );

  if (error) {
    console.error('Failed to search nearby gas stations', error);
    return [];
  }

  return response.places;
}
