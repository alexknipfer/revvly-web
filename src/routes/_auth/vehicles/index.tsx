import { createFileRoute, redirect } from '@tanstack/react-router';
import { VehiclesView } from '@/modules/vehicles/ui/views/vehicles-view';

export const Route = createFileRoute('/_auth/vehicles/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    if (context.vehicles.length) {
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
