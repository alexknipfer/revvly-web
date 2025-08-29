import { api } from 'convex/_generated/api';
import { convexQuery } from '@convex-dev/react-query';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { AddVehicleDialog } from './-components/add-vehicle-dialog';

export const Route = createFileRoute('/_auth/dashboard/manage-vehicles/')({
  component: RouteComponent,
  // beforeLoad: async ({ context }) => {
  //   await context.queryClient.ensureQueryData(
  //     convexQuery(api.vehicles.getVehicleMakesByYear, { year: 2023 }),
  //   );
  // },
});

function RouteComponent() {
  // const { data } = useSuspenseQuery(
  //   convexQuery(api.vehicles.getVehicleMakesByYear, { year: 2023 }),
  // );

  return (
    <section className="relative">
      <AddVehicleDialog />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage Vehicles</h1>
      </div>
      {/*{data.map((make) => (
        <div>{make}</div>
      ))}*/}
    </section>
  );
}
