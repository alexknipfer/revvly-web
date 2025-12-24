import { createFileRoute, redirect } from '@tanstack/react-router';
import { VehiclesView } from '@/modules/vehicles/ui/views/vehicles-view';
import { convexQuery } from '@convex-dev/react-query';
import { api } from 'convex/_generated/api';

export const Route = createFileRoute('/_auth/vehicles/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    const vehicles = await context.queryClient.ensureQueryData(
      convexQuery(api.userVehicles.getAll, {}),
    );

    if (vehicles.length) {
      const firstVehicle = vehicles[0];
      context.queryClient.prefetchQuery(
        convexQuery(api.userVehicles.getById, {
          id: firstVehicle._id,
        }),
      );

      throw redirect({
        to: '/vehicles/$vehicleId',
        params: {
          vehicleId: firstVehicle._id,
        },
      });
    }
  },
});

function RouteComponent() {
  return <VehiclesView />;
}
