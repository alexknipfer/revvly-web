import { useState } from 'react';
import { Car } from 'lucide-react';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { convexQuery } from '@convex-dev/react-query';

import { api } from 'convex/_generated/api';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Button } from '@/components/ui/button';
import { AddVehicleDialog } from '@/modules/add-vehicle/components/add-vehicle-dialog';

export const Route = createFileRoute('/_auth/vehicles/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    const vehicle = await context.queryClient.ensureQueryData(
      convexQuery(api.vehicles.getFirst, {}),
    );

    if (vehicle) {
      context.queryClient.ensureQueryData(
        convexQuery(api.vehicles.getById, {
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
  const [addVehicleOpen, setAddVehicleOpen] = useState(false);

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Car />
        </EmptyMedia>
        <EmptyTitle>No Vehicles Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any vehicles yet. Get started by creating
          your first vehicle.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button onClick={() => setAddVehicleOpen(true)}>Add Vehicle</Button>
          <AddVehicleDialog
            open={addVehicleOpen}
            onOpenChange={setAddVehicleOpen}
            onVehicleCreated={() => setAddVehicleOpen(false)}
          />
        </div>
      </EmptyContent>
    </Empty>
  );
}
