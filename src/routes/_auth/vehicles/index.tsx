import { api } from 'convex/_generated/api';
import { convexQuery } from '@convex-dev/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { VehiclesView } from '@/modules/vehicles/ui/views/vehicles-view';

export const Route = createFileRoute('/_auth/vehicles/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      convexQuery(api.userVehicles.getAll, {}),
    );
  },
});

function RouteComponent() {
  return <VehiclesView />;
}
