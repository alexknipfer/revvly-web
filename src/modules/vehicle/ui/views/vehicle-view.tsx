import { useState, useMemo } from 'react';
import { VehicleImage } from '@/modules/vehicle/ui/components/vehicle-image/vehicle-image';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Timeline, TimelineItem } from '@/components/timeline';
import { convexQuery } from '@convex-dev/react-query';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { api } from 'convex/_generated/api';
import { Id } from 'convex/_generated/dataModel';
import { Fuel, Gauge, Milestone, Plus } from 'lucide-react';
import { AddFuelEntryDialog } from '@/modules/fuel-entry/ui/components/add-fuel-entry-dialog';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item';

const routeApi = getRouteApi('/_auth/vehicles/$vehicleId/');

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  description: string;
}

// TODO: Figure out where to place this component
function StatItem({ icon, label, value, description }: StatItemProps) {
  return (
    <div className="flex flex-col items-center text-center flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

export function VehicleView() {
  const { vehicleId } = routeApi.useParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: vehicle } = useSuspenseQuery(
    convexQuery(api.userVehicles.getById, {
      id: vehicleId as Id<'vehicles'>,
    }),
  );
  const { data: fuelEntries } = useSuspenseQuery(
    convexQuery(api.fuelEntries.getAll, {
      vehicleId: vehicleId as Id<'vehicles'>,
    }),
  );

  const timelineItems: TimelineItem[] = useMemo(() => {
    return fuelEntries.map((entry) => {
      const date = new Date(entry.date);
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      return {
        icon: <Fuel className="size-4" />,
        content: (
          <Item className="p-0">
            <ItemContent>
              <ItemTitle>{formattedDate}</ItemTitle>
              <ItemDescription>
                <span className="mr-2.5">
                  {entry.totalGallons.toFixed(2)} gal
                </span>
                <span>${entry.totalCost.toFixed(2)}</span>
              </ItemDescription>
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
        ),
      };
    });
  }, [fuelEntries]);

  return (
    <div className="space-y-6">
      <div className="relative max-w-3xl mx-auto">
        <div className="rounded-lg overflow-hidden border shadow-sm">
          <VehicleImage vehicle={vehicle}>
            <VehicleImage.Upload />
          </VehicleImage>
        </div>
      </div>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              {vehicle.name || vehicle.model}
            </h1>
            <p className="text-muted-foreground text-lg">
              {vehicle.make} {vehicle.model} {vehicle.year}
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="shrink-0">
            <Plus className="size-4" />
            Add Fuel Entry
          </Button>
        </div>

        <div className="bg-card border rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex flex-row items-stretch gap-4 sm:gap-6">
            <StatItem
              icon={<Gauge className="size-4 text-blue-500" />}
              label="MPG"
              value={
                vehicle.averageMpg > 0 ? vehicle.averageMpg.toFixed(1) : '--'
              }
              description="Average"
            />
            <Separator orientation="vertical" className="h-auto" />
            <StatItem
              icon={<Milestone className="size-4 text-green-500" />}
              label="Miles"
              value={
                vehicle.totalMilesTracked > 0
                  ? vehicle.totalMilesTracked.toLocaleString()
                  : '--'
              }
              description="Tracked"
            />
            <Separator orientation="vertical" className="h-auto" />
            <StatItem
              icon={<Fuel className="size-4 text-orange-500" />}
              label="Gallons"
              value={
                vehicle.totalGallonsUsed > 0
                  ? vehicle.totalGallonsUsed.toFixed(1)
                  : '--'
              }
              description="Used"
            />
          </div>
        </div>

        {fuelEntries.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Fuel Entries</h2>
            <Timeline items={timelineItems} />
          </div>
        )}
      </div>
      <AddFuelEntryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        vehicleId={vehicleId as Id<'vehicles'>}
        latestOdometer={vehicle.latestOdometer}
      />
    </div>
  );
}
