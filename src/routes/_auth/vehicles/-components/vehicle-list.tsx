import { convexQuery } from '@convex-dev/react-query';
import { useSuspenseQuery } from '@tanstack/react-query';

import { api } from '../../../../../convex/_generated/api';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

import { VehicleListCard } from './vehicle-list-card';
import { Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { AddVehicleDialog } from '@/components/add-vehicle-dialog';

export function VehicleList() {
  const [addVehicleOpen, setAddVehicleOpen] = useState(false);

  const { data: vehicles } = useSuspenseQuery(
    convexQuery(api.userVehicles.getAll, {}),
  );

  if (!vehicles.length) {
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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-[repeat(auto-fit,400px)] gap-4">
      {vehicles.map((vehicle) => (
        <VehicleListCard key={vehicle._id} vehicle={vehicle} />
      ))}
    </div>
  );
}
