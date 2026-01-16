import { useMemo, useState } from 'react';
import { convexQuery } from '@convex-dev/react-query';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { Fuel } from 'lucide-react';

import { Timeline, TimelineItem } from '@/components/timeline';
import { api } from 'convex/_generated/api';
import { Id } from 'convex/_generated/dataModel';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Button } from '@/components/ui/button';
import { AddFuelEntryDialog } from '@/modules/fuel-entry/components/add-fuel-entry-dialog';
import { toast } from 'sonner';
import { VehicleFuelEntryTimelineItem } from '@/modules/vehicle/components/vehicle-timeline/vehicle-fuel-entry-timeline-item';

const routeApi = getRouteApi('/_auth/vehicles/$vehicleId');

export function VehicleTimeline() {
  const { vehicleId } = routeApi.useParams();
  const [fuelEntryDialogOpen, setFuelEntryDialogOpen] = useState(false);

  const { data: fuelEntries } = useSuspenseQuery(
    convexQuery(api.fuelEntries.getAll, {
      vehicleId: vehicleId as Id<'vehicles'>,
    }),
  );

  const timelineItems: Array<TimelineItem> = useMemo(() => {
    return fuelEntries.map((entry) => {
      return {
        icon: <Fuel className="size-4" />,
        content: <VehicleFuelEntryTimelineItem fuelEntry={entry} />,
      };
    });
  }, [fuelEntries]);

  if (fuelEntries.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Fuel />
          </EmptyMedia>
          <EmptyTitle>No Fuel Entries Yet</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t added any fuel entries yet. Get started by adding
            your first fuel entry.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={() => setFuelEntryDialogOpen(true)}>
            Add Fuel Entry
          </Button>
          <AddFuelEntryDialog
            open={fuelEntryDialogOpen}
            onOpenChange={setFuelEntryDialogOpen}
            onFuelEntryCreated={() =>
              toast.success('Fuel entry added successfully')
            }
          />
        </EmptyContent>
      </Empty>
    );
  }

  return <Timeline items={timelineItems} />;
}
