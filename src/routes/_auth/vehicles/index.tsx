import { createFileRoute, redirect } from '@tanstack/react-router';
import { VehiclesView } from '@/modules/vehicles/ui/views/vehicles-view';
import { convexQuery } from '@convex-dev/react-query';
import { api } from 'convex/_generated/api';

export const Route = createFileRoute('/_auth/vehicles/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    if (context.vehicles.length) {
      const firstVehicle = context.vehicles[0];
      context.queryClient.prefetchQuery(
        convexQuery(api.userVehicles.getById, {
          id: firstVehicle._id,
        }),
      );

      throw redirect({
        to: '/vehicles/$vehicleId',
        params: {
          vehicleId: context.vehicles[0]._id,
        },
      });
    }
  },
});

function RouteComponent() {
  return <VehiclesView />;
}
