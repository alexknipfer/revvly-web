import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { vehicleByIdQueryOptions } from '../../lib/query-options';
import { VehicleActionsMenu } from '../components/vehicle-actions-menu';
import { VehicleTimeline } from '../components/vehicle-timeline';
import { VehicleImage } from '../components/vehicle-image/vehicle-image';
import { AddFuelEntryMenu } from '../components/fuel-entry/add-fuel-entry-menu';
import { MpgTrendChart } from '../components/charts/mpg-trend-chart';
import { FuelCostChart } from '../components/charts/fuel-cost-chart';
import { convexQuery } from '@convex-dev/react-query';
import { api } from 'convex/_generated/api';
import { Id } from 'convex/_generated/dataModel';
import { hasDefined } from '@/modules/core/lib/utils';

const routeApi = getRouteApi('/_auth/vehicles/$vehicleId');

interface CompactStatProps {
  label: string;
  value: string | number;
}

function CompactStat({ label, value }: CompactStatProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-lg font-semibold tabular-nums">{value}</span>
    </div>
  );
}

export function VehicleView() {
  const { vehicleId } = routeApi.useParams();

  const { data: vehicle } = useSuspenseQuery(
    vehicleByIdQueryOptions({ vehicleId }),
  );
  const { data: fuelEntries } = useSuspenseQuery(
    convexQuery(api.fuelEntries.getAll, {
      vehicleId: vehicleId as Id<'vehicles'>,
    }),
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
                  <CompactStat
                    label="Average MPG"
                    value={
                      vehicle.averageMpg > 0
                        ? vehicle.averageMpg.toFixed(1)
                        : '--'
                    }
                  />
                  <CompactStat
                    label="Total Miles Tracked"
                    value={
                      vehicle.totalMilesTracked > 0
                        ? vehicle.totalMilesTracked.toLocaleString()
                        : '--'
                    }
                  />
                  <CompactStat
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
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MpgTrendChart
                data={fuelEntries.filter(hasDefined('mpg')).map((entry) => ({
                  date: entry.date,
                  mpg: entry.mpg,
                }))}
              />
              <FuelCostChart
                data={fuelEntries.map((entry) => ({
                  date: entry.date,
                  cost: entry.totalCost,
                }))}
              />
            </div>
          </TabsContent>
          <TabsContent value="history" className="mt-6">
            <VehicleTimeline />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
