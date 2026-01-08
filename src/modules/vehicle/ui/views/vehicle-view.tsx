import { useState } from 'react';
import { toast } from 'sonner';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { Gauge, Milestone, Fuel } from 'lucide-react';

import { Separator } from '@/components/ui/separator';
import { Id } from 'convex/_generated/dataModel';
import { AddFuelEntryDialog } from '@/modules/fuel-entry/ui/components/add-fuel-entry-dialog';

import { vehicleByIdQueryOptions } from '../../lib/query-options';
import { VehicleActionsMenu } from '../components/vehicle-actions-menu';
import { VehicleTimeline } from '../components/vehicle-timeline';
import { VehicleImage } from '../components/vehicle-image/vehicle-image';

const routeApi = getRouteApi('/_auth/vehicles/$vehicleId');

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
    vehicleByIdQueryOptions({ vehicleId }),
  );

  return (
    <div className="space-y-6">
      <div className="relative max-w-3xl mx-auto">
        <div className="rounded-lg overflow-hidden border shadow-sm">
          <VehicleImage vehicle={vehicle}>
            <VehicleImage.Upload />
          </VehicleImage>
        </div>
      </div>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">
                {vehicle.name || vehicle.model}
              </h1>
              <VehicleActionsMenu />
            </div>
            <p className="text-muted-foreground text-lg">
              {vehicle.make} {vehicle.model} {vehicle.year}
            </p>
          </div>
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
        <VehicleTimeline />
      </div>
      <AddFuelEntryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        vehicleId={vehicleId as Id<'vehicles'>}
        latestOdometer={vehicle.latestOdometer}
        onFuelEntryCreated={() =>
          toast.success('Fuel entry added successfully')
        }
      />
    </div>
  );
}
