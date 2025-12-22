import ky from 'ky';

import { appConfig } from '@/lib/appConfig';
import { tryCatch } from '@/lib/utils';
import type { SearchBoxFeatureCollection } from '@/types/mapbox-search';

const mapboxApi = ky.extend({
  prefixUrl: appConfig.mapbox.baseUrl,
});

export async function searchNearbyGasStations({
  coordinates,
  limit = 10,
}: {
  coordinates: [number, number];
  limit?: number;
}) {
  const [error, response] = await tryCatch(
    mapboxApi
      .get<SearchBoxFeatureCollection>(
        'search/searchbox/v1/category/gas_station',
        {
          searchParams: {
            proximity: `${coordinates[0]},${coordinates[1]}`,
            limit,
            access_token: appConfig.mapbox.accessToken,
          },
        },
      )
      .json(),
  );

  if (error) {
    console.error('Failed to search nearby gas stations', error);

    return [];
  }

  return response.features.map((feature) => ({
    name: feature.properties.name_preferred || feature.properties.name,
    address:
      feature.properties.address ||
      feature.properties.full_address ||
      feature.properties.place_formatted ||
      '',
    coordinates: feature.geometry.coordinates,
  }));
}
