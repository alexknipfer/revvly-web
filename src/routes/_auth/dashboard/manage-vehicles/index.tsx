import { api } from 'convex/_generated/api';
import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { convexQuery } from '@convex-dev/react-query';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';

export const Route = createFileRoute('/_auth/dashboard/manage-vehicles/')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      convexQuery(api.vehicles.getVehicleMakesByYear, { year: 2023 }),
    );
  },
});

function RouteComponent() {
  const { data } = useSuspenseQuery(
    convexQuery(api.vehicles.getVehicleMakesByYear, { year: 2023 }),
  );

  return (
    <section className="relative">
      <Button
        type="button"
        className="fixed bottom-5 right-5 rounded-full bg-blue-500 h-12 w-12 ring-1 ring-blue-700"
      >
        <PlusIcon className="text-white size-5" />
      </Button>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage Vehicles</h1>
      </div>
      {data.map((make) => (
        <div>{make}</div>
      ))}
    </section>
  );
}
