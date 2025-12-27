import { useState } from 'react';
import { VehicleImage } from '@/modules/vehicle/ui/components/vehicle-image/vehicle-image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { convexQuery } from '@convex-dev/react-query';
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { api } from 'convex/_generated/api';
import { Id } from 'convex/_generated/dataModel';
import { Fuel, Gauge, Milestone, Plus } from 'lucide-react';
import { AddFuelEntryDialog } from '@/modules/fuel-entry/ui/components/add-fuel-entry-dialog';

const routeApi = getRouteApi('/_auth/vehicles/$vehicleId/');

export function VehicleView() {
  const { vehicleId } = routeApi.useParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: vehicle } = useSuspenseQuery(
    convexQuery(api.userVehicles.getById, {
      id: vehicleId as Id<'vehicles'>,
    }),
  );

  const handleFuelEntryCreated = () => {
    // Invalidate the vehicle query to refresh the data
    queryClient.invalidateQueries({
      queryKey: [
        'convex',
        api.userVehicles.getById,
        { id: vehicleId as Id<'vehicles'> },
      ],
    });
  };

  return (
    <div className="space-y-6">
      <div className="relative max-w-3xl mx-auto">
        <div className="rounded-lg overflow-hidden border shadow-sm">
          <VehicleImage vehicle={vehicle}>
            <VehicleImage.Upload />
          </VehicleImage>
        </div>
      </div>
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-start justify-between gap-4">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Gauge className="size-5 text-blue-500" />
                Average MPG
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {vehicle.averageMpg > 0 ? vehicle.averageMpg.toFixed(1) : '--'}
              </div>
              <CardDescription className="mt-1">
                Miles per gallon
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Milestone className="size-5 text-green-500" />
                Total Miles Tracked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {vehicle.totalMilesTracked > 0
                  ? vehicle.totalMilesTracked.toLocaleString()
                  : '--'}
              </div>
              <CardDescription className="mt-1">Miles recorded</CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Fuel className="size-5 text-orange-500" />
                Total Gallons Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {vehicle.totalGallonsUsed > 0
                  ? vehicle.totalGallonsUsed.toFixed(1)
                  : '--'}
              </div>
              <CardDescription className="mt-1">
                Gallons of fuel
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
      <AddFuelEntryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        vehicleId={vehicleId as Id<'vehicles'>}
        onFuelEntryCreated={handleFuelEntryCreated}
      />
    </div>
  );
}
