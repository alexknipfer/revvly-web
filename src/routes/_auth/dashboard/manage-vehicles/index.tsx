import { api } from 'convex/_generated/api';
import { convexQuery } from '@convex-dev/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Authenticated, AuthLoading } from 'convex/react';
import { VehicleList } from './-components/vehicle-list';
import { AddVehicleDialog } from './-components/add-vehicle-dialog';

export const Route = createFileRoute('/_auth/dashboard/manage-vehicles/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(
      convexQuery(api.userVehicles.getAll, {}),
    );
  },
});

function RouteComponent() {
  return (
    <section className="relative space-y-2.5">
      <h1 className="text-2xl font-semibold">Manage Vehicles</h1>
      <Authenticated>
        <VehicleList />
        <AddVehicleDialog />
      </Authenticated>
      <AuthLoading>
        <div>Auth loading...</div>
      </AuthLoading>
    </section>
  );
}
