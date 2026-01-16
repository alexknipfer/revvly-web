import { convexQuery } from '@convex-dev/react-query';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { AddFuelEntryMenu } from '@/modules/fuel-entry/components/add-fuel-entry-menu';
import { VehicleActionsMenu } from '@/modules/vehicle/components/vehicle-actions-menu';
import { VehicleImage } from '@/modules/vehicle/components/vehicle-image/vehicle-image';
import { vehicleByIdQueryOptions } from '@/api/query-options';
import { VehicleStatCard } from '@/modules/vehicle/components/vehicle-stat-card';
import { MpgTrendChart } from '@/modules/fuel-entry/components/charts/mpg-trend-chart';
import { FuelCostChart } from '@/modules/fuel-entry/components/charts/fuel-cost-chart';
import { FuelEntryTimeline } from '@/modules/fuel-entry/components/fuel-entry-timeline';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { api } from 'convex/_generated/api';
import { Id } from 'convex/_generated/dataModel';

export const Route = createFileRoute('/_auth/vehicles/$vehicleId')({
  component: RouteComponent,
  // TODO: Add a loading state
  pendingComponent: () => <div>Loading vehicle data...</div>,
  loader: async ({ context, params }) => {
    context.queryClient.prefetchQuery(
      convexQuery(api.fuelEntries.getAll, {
        vehicleId: params.vehicleId as Id<'vehicles'>,
      }),
    );

    await context.queryClient.ensureQueryData(
      convexQuery(api.vehicles.getById, {
        id: params.vehicleId as Id<'vehicles'>,
      }),
    );
  },
});

function RouteComponent() {
  const { vehicleId } = Route.useParams();

  const { data: vehicle } = useSuspenseQuery(
    vehicleByIdQueryOptions({ vehicleId }),
  );

  return (
    <div className="space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col md:grid md:grid-cols-[auto_1fr] gap-4 items-start">
            <div className="w-full md:w-48 rounded-lg overflow-hidden border shadow-sm shrink-0">
              <VehicleImage vehicle={vehicle}>
                <VehicleImage.Upload />
              </VehicleImage>
            </div>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 min-w-0 w-full">
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {vehicle.name || vehicle.model}
                  </h1>
                  <div className="flex md:hidden gap-2 shrink-0">
                    <VehicleActionsMenu />
                    <AddFuelEntryMenu />
                  </div>
                </div>
                <p className="text-muted-foreground text-base md:text-lg mb-3 md:mb-4">
                  {vehicle.make} {vehicle.model} {vehicle.year}
                </p>
                <div className="grid grid-cols-3 gap-4 md:flex md:items-center md:gap-6">
                  <VehicleStatCard
                    label="Average MPG"
                    value={
                      vehicle.averageMpg > 0
                        ? vehicle.averageMpg.toFixed(1)
                        : '--'
                    }
                  />
                  <VehicleStatCard
                    label="Total Miles Tracked"
                    value={
                      vehicle.totalMilesTracked > 0
                        ? vehicle.totalMilesTracked.toLocaleString()
                        : '--'
                    }
                  />
                  <VehicleStatCard
                    label="Total Gallons Used"
                    value={
                      vehicle.totalGallonsUsed > 0
                        ? vehicle.totalGallonsUsed.toFixed(1)
                        : '--'
                    }
                  />
                </div>
              </div>
              <div className="hidden md:flex space-x-2 shrink-0">
                <VehicleActionsMenu />
                <AddFuelEntryMenu />
              </div>
            </div>
          </div>
        </div>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vehicle-logs">Vehicle Logs</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MpgTrendChart vehicleId={vehicleId} />
              <FuelCostChart vehicleId={vehicleId} />
            </div>
          </TabsContent>
          <TabsContent value="vehicle-logs" className="mt-6">
            <FuelEntryTimeline vehicleId={vehicleId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
