import { useState } from 'react';
import { Car } from 'lucide-react';

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

export function VehiclesView() {
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
