import { convexQuery } from '@convex-dev/react-query';
import { queryOptions } from '@tanstack/react-query';

import { api } from 'convex/_generated/api';
import { Id } from 'convex/_generated/dataModel';

interface Args {
  vehicleId: string;
}

export const vehicleByIdQueryOptions = ({ vehicleId }: Args) =>
  queryOptions(
    convexQuery(api.vehicles.getById, {
      id: vehicleId as Id<'vehicles'>,
    }),
  );
