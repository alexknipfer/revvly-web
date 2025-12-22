import { VehicleDetails } from '@/routes/_auth/vehicles/$vehicleId/-components/vehicle-details';
import { convexQuery } from '@convex-dev/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { api } from 'convex/_generated/api';
import { Id } from 'convex/_generated/dataModel';

export const Route = createFileRoute('/_auth/vehicles/$vehicleId/')({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      convexQuery(api.userVehicles.getById, {
        id: params.vehicleId as Id<'vehicles'>,
      }),
    );
  },
});

function RouteComponent() {
  return <VehicleDetails />;
}
