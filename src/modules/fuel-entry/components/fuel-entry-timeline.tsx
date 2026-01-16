import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense, useMemo, useState } from 'react';
import { Fuel, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { getRouteApi } from '@tanstack/react-router';

import { Timeline } from '@/components/timeline';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item';
import { fuelEntriesOptions } from '@/api/query-options';
import { DrawerDialog } from '@/components/ui/dialog-drawer';

import { Doc } from 'convex/_generated/dataModel';

import { AddFuelEntryDialog } from './add-fuel-entry-dialog';
import { EditFuelEntryForm } from './forms/edit-fuel-entry-form';

const routeApi = getRouteApi('/_auth/vehicles/$vehicleId');

export function FuelEntryTimeline() {
  return (
    <Suspense fallback={<FuelEntryTimelineSkeleton />}>
      <FuelEntryTimelineContent />
    </Suspense>
  );
}

function FuelEntryTimelineContent() {
  const { vehicleId } = routeApi.useParams();
  const [fuelEntryDialogOpen, setFuelEntryDialogOpen] = useState(false);

  const { data: fuelEntries } = useSuspenseQuery(fuelEntriesOptions(vehicleId));

  const timelineItems = useMemo(() => {
    return fuelEntries.map((entry) => ({
      icon: <Fuel className="size-4" />,
      content: <FuelEntryTimelineItem key={entry._id} entry={entry} />,
    }));
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

function FuelEntryTimelineItem({ entry }: { entry: Doc<'fuel_entries'> }) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const date = new Date(entry.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <>
      <Item className="p-0">
        <ItemContent>
          <div className="flex items-center gap-2">
            <ItemTitle>{formattedDate}</ItemTitle>
            {entry.missedFuelup && (
              <Badge variant="outline" className="text-xs">
                Missed Fuel Up
              </Badge>
            )}
          </div>
          <ItemDescription>
            <span className="mr-2.5">{entry.totalGallons.toFixed(2)} gal</span>
            <span>${entry.totalCost.toFixed(2)}</span>
          </ItemDescription>
        </ItemContent>
        <ItemContent className="flex-none">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditDialogOpen(true)}
          >
            <Pencil className="size-4" />
          </Button>
        </ItemContent>

        <ItemContent className="flex-none">
          <div className="px-1.5 bg-secondary rounded-sm text-center py-1">
            <p className="font-semibold text-sm">
              {entry.mpg ? entry.mpg.toFixed(1) : '--'}
            </p>
            <p className="text-xs text-muted-foreground">MPG</p>
          </div>
        </ItemContent>
      </Item>
      <DrawerDialog
        title="Edit Fuel Entry"
        description="Update your fuel fill-up details"
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        hideHeaderOnMobile
      >
        <EditFuelEntryForm
          fuelEntryId={entry._id}
          onSuccess={() => {
            toast.success('Fuel entry updated successfully');
            setEditDialogOpen(false);
          }}
          fetchFuelEntryEnabled={editDialogOpen}
        />
      </DrawerDialog>
    </>
  );
}

function FuelEntryTimelineSkeleton() {
  return (
    <div>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex gap-4 min-h-2.5">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center rounded-full bg-secondary size-7 shrink-0 animate-pulse">
              <div className="size-4 bg-muted rounded" />
            </div>
            {index < 2 && <div className="w-0.5 bg-muted h-full" />}
          </div>
          <div className="pb-6 w-full">
            <div className="group/item flex items-center border border-transparent text-sm rounded-md p-0 gap-4">
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-24 bg-muted rounded animate-pulse" />
                  <div className="h-5 w-20 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              </div>
              <div className="flex-none">
                <div className="size-9 bg-muted rounded animate-pulse" />
              </div>
              <div className="flex-none">
                <div className="px-1.5 bg-secondary rounded-sm text-center py-1 w-12">
                  <div className="h-4 w-8 bg-muted rounded animate-pulse mb-1 mx-auto" />
                  <div className="h-3 w-6 bg-muted rounded animate-pulse mx-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
