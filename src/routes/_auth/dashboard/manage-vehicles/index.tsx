import { api } from 'convex/_generated/api';
import { convexQuery } from '@convex-dev/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { VehicleList } from './-components/vehicle-list';
import { Suspense } from 'react';
import { AuthLoading } from 'convex/react';

export const Route = createFileRoute('/_auth/dashboard/manage-vehicles/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      convexQuery(api.userVehicles.getAll, {}),
    );
  },
});

function RouteComponent() {
  return (
    <section className="relative space-y-2.5">
      <h1 className="text-2xl font-semibold">Manage Vehicles</h1>
      {/** TODO: Add a loading state */}
      <Suspense fallback={<div>Suspense fallback loading...</div>}>
        <VehicleList />
      </Suspense>
      <AuthLoading>
        <div>Auth loading...</div>
      </AuthLoading>
    </section>
  );
}
