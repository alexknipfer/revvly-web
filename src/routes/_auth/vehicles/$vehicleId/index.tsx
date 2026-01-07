import { VehicleView } from '@/modules/vehicle/ui/views/vehicle-view';
import { convexQuery } from '@convex-dev/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { api } from 'convex/_generated/api';
import { Id } from 'convex/_generated/dataModel';

export const Route = createFileRoute('/_auth/vehicles/$vehicleId/')({
  component: RouteComponent,
  // TODO: Add a loading state
  pendingComponent: () => <div>Loading vehicle data...</div>,
  loader: async ({ context, params }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(
        convexQuery(api.fuelEntries.getAll, {
          vehicleId: params.vehicleId as Id<'vehicles'>,
        }),
      ),
      context.queryClient.ensureQueryData(
        convexQuery(api.vehicles.getById, {
          id: params.vehicleId as Id<'vehicles'>,
        }),
      ),
    ]);
  },
});

function RouteComponent() {
  return <VehicleView />;
}
