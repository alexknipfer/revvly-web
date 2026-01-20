import { convexQuery } from '@convex-dev/react-query';
import { queryOptions } from '@tanstack/react-query';

import { api } from 'convex/_generated/api';
import { Id } from 'convex/_generated/dataModel';

import { searchNearbyGasStations } from './google-places';

interface VehicleByIdArgs {
  vehicleId: string;
}

export const vehicleByIdQueryOptions = ({ vehicleId }: VehicleByIdArgs) =>
  queryOptions(
    convexQuery(api.vehicles.getById, {
      id: vehicleId as Id<'vehicles'>,
    }),
  );

interface NearbyGasStationsArgs {
  lat: number;
  lng: number;
  enabled?: boolean;
}

export const nearbyGasStationsQueryOptions = ({
  lat,
  lng,
  enabled = true,
}: NearbyGasStationsArgs) =>
  queryOptions({
    queryKey: ['gasStations', lng, lat],
    queryFn: () =>
      searchNearbyGasStations({
        latitude: lat,
        longitude: lng,
      }),
    enabled,
  });

interface FuelEntryByIdArgs {
  id: string;
  enabled?: boolean;
}

export const fuelEntryByIdQueryOptions = ({
  id,
  enabled = true,
}: FuelEntryByIdArgs) =>
  queryOptions({
    ...convexQuery(
      api.fuelEntries.getById,
      enabled
        ? {
            id: id as Id<'fuel_entries'>,
          }
        : 'skip',
    ),
    enabled,
  });

export const fuelEntriesOptions = (vehicleId: string) =>
  queryOptions(
    convexQuery(api.fuelEntries.getAll, {
      vehicleId: vehicleId as Id<'vehicles'>,
    }),
  );

interface ServiceByIdArgs {
  id: Id<'services'>;
  enabled?: boolean;
}

export const serviceByIdQueryOptions = ({
  id,
  enabled = true,
}: ServiceByIdArgs) =>
  queryOptions({
    ...convexQuery(
      api.services.getById,
      enabled
        ? {
            id: id as Id<'services'>,
          }
        : 'skip',
    ),
    enabled,
  });

export const servicesOptions = (vehicleId: string) =>
  queryOptions(
    convexQuery(api.services.getAll, {
      vehicleId: vehicleId as Id<'vehicles'>,
    }),
  );
