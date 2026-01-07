import { createFileRoute, redirect } from '@tanstack/react-router';
import { VehiclesView } from '@/modules/vehicles/ui/views/vehicles-view';
import { convexQuery } from '@convex-dev/react-query';
import { api } from 'convex/_generated/api';

export const Route = createFileRoute('/_auth/vehicles/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    const vehicle = await context.queryClient.ensureQueryData(
      convexQuery(api.userVehicles.getFirst, {}),
    );

    if (vehicle) {
      context.queryClient.ensureQueryData(
        convexQuery(api.userVehicles.getById, {
          id: vehicle._id,
        }),
      );

      throw redirect({
        to: '/vehicles/$vehicleId',
        params: {
          vehicleId: vehicle._id,
        },
      });
    }
  },
});

function RouteComponent() {
  return <VehiclesView />;
}
