import { convexQuery } from '@convex-dev/react-query';
import { api } from '../../../../../../convex/_generated/api';
import { useSuspenseQuery } from '@tanstack/react-query';

export function MyVehicles() {
  const { data: vehicles } = useSuspenseQuery(
    convexQuery(api.vehicles.getUserVehicles, {}),
  );

  return (
    <div>Testing</div>
    // <div>
    //   {vehicles.map((vehicle) => (
    //     <div key={vehicle._id}>{vehicle.model}</div>
    //   ))}
    // </div>
  );
}
