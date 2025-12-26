import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

import { googlePlacesApi } from '@/lib/google';
import { tryCatch } from '@/lib/utils';
import { type GooglePlacesNearbyResponse } from '@/types/google';

const SearchNearbyGasStationsSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  limit: z.number().optional().default(10),
  radius: z.number().optional().default(5000),
});

export const searchNearbyGasStationsServerFn = createServerFn()
  .inputValidator(SearchNearbyGasStationsSchema)
  .handler(async ({ data }) => {
    const { latitude, longitude, limit, radius } = data;

    const [error, response] = await tryCatch(
      googlePlacesApi()
        .post<GooglePlacesNearbyResponse>(':searchNearby', {
          headers: {
            'X-Goog-FieldMask':
              'places.displayName,places.location,places.formattedAddress',
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
  });
