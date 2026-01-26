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


export const getAllVehiclesQueryOptions = () =>
  queryOptions(
    convexQuery(api.vehicles.getAll, {}),
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

export const fuelEntryByIdQueryOptions = (id: string) =>
  queryOptions(
    convexQuery(api.fuelEntries.getById, {
      id: id as Id<'fuel_entries'>,
    }),
  );

export const fuelEntriesOptions = (vehicleId: string) =>
  queryOptions(
    convexQuery(api.fuelEntries.getAll, {
      vehicleId: vehicleId as Id<'vehicles'>,
    }),
  );

interface ServiceByIdArgs {
  id: string;
  vehicleId: string;
}

export const serviceByIdQueryOptions = ({ id, vehicleId }: ServiceByIdArgs) =>
  queryOptions(
    convexQuery(api.services.getById, {
      id: id as Id<'services'>,
      vehicleId: vehicleId as Id<'vehicles'>,
    }),
  );

export const servicesOptions = (vehicleId: string) =>
  queryOptions(
    convexQuery(api.services.getAll, {
      vehicleId: vehicleId as Id<'vehicles'>,
    }),
  );
