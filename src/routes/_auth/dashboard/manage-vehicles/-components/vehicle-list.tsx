import { convexQuery } from '@convex-dev/react-query';
import { useSuspenseQuery } from '@tanstack/react-query';

import { api } from '../../../../../../convex/_generated/api';

import { VehicleDetails } from './vehicle-details';

export function VehicleList() {
  const { data: vehicles } = useSuspenseQuery(
    convexQuery(api.userVehicles.getAll, {}),
  );

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min-content,400px))] gap-4">
      {vehicles.map((vehicle) => (
        <VehicleDetails key={vehicle._id} vehicle={vehicle} />
      ))}
    </div>
  );
}
