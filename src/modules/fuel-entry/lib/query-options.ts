import { queryOptions } from '@tanstack/react-query';

import { searchNearbyGasStations } from './search-nearby-gas-stations';

interface Args {
  lat: number;
  lng: number;
  enabled?: boolean;
}

export const nearbyGasStationsQueryOptions = ({
  lat,
  lng,
  enabled = true,
}: Args) =>
  queryOptions({
    queryKey: ['gasStations', lng, lat],
    queryFn: () =>
      searchNearbyGasStations({
        latitude: lat,
        longitude: lng,
      }),
    enabled,
  });
