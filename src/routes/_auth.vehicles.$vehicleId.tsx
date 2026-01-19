import { convexQuery } from '@convex-dev/react-query';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { useState } from 'react';
import { toast } from 'sonner';
import { Fuel, Plus, Wrench } from 'lucide-react';

import { AddFuelEntryMenu } from '@/modules/fuel-entry/components/add-fuel-entry-menu';
import { VehicleActionsMenu } from '@/modules/vehicle/components/vehicle-actions-menu';
import { VehicleImage } from '@/modules/vehicle/components/vehicle-image/vehicle-image';
import { vehicleByIdQueryOptions } from '@/api/query-options';
import { VehicleStatCard } from '@/modules/vehicle/components/vehicle-stat-card';
import { MpgTrendChart } from '@/modules/fuel-entry/components/charts/mpg-trend-chart';
import { FuelCostChart } from '@/modules/fuel-entry/components/charts/fuel-cost-chart';
import { FuelEntryTimeline } from '@/modules/fuel-entry/components/fuel-entry-timeline';
import { ServiceTimeline } from '@/modules/service/components/service-timeline';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { api } from 'convex/_generated/api';
import { Id } from 'convex/_generated/dataModel';
import { AddFuelEntryDialog } from '@/modules/fuel-entry/components/add-fuel-entry-dialog';
import { AddServiceDialog } from '@/modules/service/components/add-service-dialog';
import { Button } from '@/components/ui/button';

const searchSchema = z.object({
  activeTab: z
    .enum(['overview', 'fuel-logs', 'service-logs'])
    .optional()
    .catch('overview'),
});

export const Route = createFileRoute('/_auth/vehicles/$vehicleId')({
  component: RouteComponent,
  pendingComponent: LoadingComponent,
  validateSearch: searchSchema,
  loader: async ({ context, params }) => {
    context.queryClient.prefetchQuery(
      convexQuery(api.fuelEntries.getAll, {
        vehicleId: params.vehicleId as Id<'vehicles'>,
      }),
    );

    context.queryClient.prefetchQuery(
      convexQuery(api.services.getAll, {
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
  const { activeTab } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const [fuelEntryDialogOpen, setFuelEntryDialogOpen] = useState(false);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);

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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="shrink-0">
                      <Plus className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      onClick={() => setFuelEntryDialogOpen(true)}
                    >
                      <Fuel className="size-4" />
                      Add Fuel Entry
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setServiceDialogOpen(true)}
                    >
                      <Wrench className="size-4" />
                      Add Service
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                  <AddFuelEntryDialog
                    open={fuelEntryDialogOpen}
                    onOpenChange={setFuelEntryDialogOpen}
                    onFuelEntryCreated={() => {
                      setFuelEntryDialogOpen(false);
                      toast.success('Fuel entry added successfully');
                    }}
                  />
                  <AddServiceDialog
                    open={serviceDialogOpen}
                    onOpenChange={setServiceDialogOpen}
                    onServiceCreated={() => {
                      setServiceDialogOpen(false);
                      toast.success('Service entry added successfully');
                    }}
                  />
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            navigate({
              search: {
                activeTab: value as 'overview' | 'fuel-logs' | 'service-logs',
              },
            })
          }
          className="w-full"
        >
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="fuel-logs">Fuel Logs</TabsTrigger>
            <TabsTrigger value="service-logs">Service Logs</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MpgTrendChart />
              <FuelCostChart />
            </div>
          </TabsContent>
          <TabsContent value="fuel-logs" className="mt-6">
            <FuelEntryTimeline />
          </TabsContent>
          <TabsContent value="service-logs" className="mt-6">
            <ServiceTimeline />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function LoadingComponent() {
  return (
    <div className="space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col md:grid md:grid-cols-[auto_1fr] gap-4 items-start">
            {/* Vehicle Image Skeleton */}
            <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden border shadow-sm shrink-0 bg-muted animate-pulse" />

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 min-w-0 w-full">
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  {/* Vehicle Name Skeleton */}
                  <div className="h-8 md:h-9 w-48 md:w-64 bg-muted rounded animate-pulse" />
                  {/* Mobile Action Buttons Skeleton */}
                  <div className="flex md:hidden gap-2 shrink-0">
                    <div className="size-9 bg-muted rounded animate-pulse" />
                    <div className="size-9 bg-muted rounded animate-pulse" />
                  </div>
                </div>
                {/* Vehicle Description Skeleton */}
                <div className="h-5 md:h-6 w-40 md:w-56 bg-muted rounded animate-pulse mb-3 md:mb-4" />

                {/* Stat Cards Skeleton */}
                <div className="grid grid-cols-3 gap-4 md:flex md:items-center md:gap-6">
                  <div className="flex flex-col gap-0.5">
                    <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                    <div className="h-5 w-12 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                    <div className="h-5 w-16 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="h-3 w-28 bg-muted rounded animate-pulse" />
                    <div className="h-5 w-14 bg-muted rounded animate-pulse" />
                  </div>
                </div>
              </div>
              {/* Desktop Action Buttons Skeleton */}
              <div className="hidden md:flex space-x-2 shrink-0">
                <div className="size-9 bg-muted rounded animate-pulse" />
                <div className="size-9 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vehicle-logs">Vehicle Logs</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* MPG Trend Chart Skeleton */}
              <Card>
                <CardHeader>
                  <CardTitle>MPG Trend</CardTitle>
                  <CardDescription>Last 12 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
              {/* Fuel Cost Chart Skeleton */}
              <Card>
                <CardHeader>
                  <CardTitle>Fuel Cost</CardTitle>
                  <CardDescription>Last 12 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="vehicle-logs" className="mt-6">
            {/* Fuel Entry Timeline Skeleton */}
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
