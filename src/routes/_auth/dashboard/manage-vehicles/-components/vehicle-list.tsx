import { convexQuery } from '@convex-dev/react-query';
import { useSuspenseQuery } from '@tanstack/react-query';

import { api } from '../../../../../../convex/_generated/api';

import { VehicleDetails } from './vehicle-details';

export function VehicleList() {
  const { data: vehicles } = useSuspenseQuery(
    convexQuery(api.userVehicles.getAll, {}),
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,400px)] gap-4">
      {vehicles.map((vehicle) => (
        <VehicleDetails key={vehicle._id} vehicle={vehicle} />
      ))}
    </div>
  );
}
