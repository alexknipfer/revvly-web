import { api } from 'convex/_generated/api';
import { convexQuery } from '@convex-dev/react-query';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

// import { AddVehicleDialog } from './-components/add-vehicle-dialog';
// import { MyVehicles } from './-components/my-vehicles';
import { Authenticated, AuthLoading } from 'convex/react';
// import { AddVehicleDialog } from './-components/add-vehicle-dialog';

export const Route = createFileRoute('/_auth/dashboard/manage-vehicles/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    // console.log('loader token: ', context.token);
    console.log('calling ensureQueryData');
    await context.queryClient.ensureQueryData(
      convexQuery(api.vehicles.getUserVehicles, {}),
    );
  },
});

function RouteComponent() {
  // const { data: vehicles } = useSuspenseQuery(
  //   convexQuery(api.vehicles.getUserVehicles, {}),
  // );

  return (
    <section className="relative">
      {/* <Authenticated>
        <AddVehicleDialog />
      </Authenticated> */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage Vehicles</h1>
      </div>
      {/* <Authenticated>
        <MyVehicles />
      </Authenticated> */}
      <AuthLoading>Loading...</AuthLoading>
      {/* {vehicles.map((vehicle) => (
        <div key={vehicle._id}>{vehicle.model}</div>
      ))} */}
    </section>
  );
}
