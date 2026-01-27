import React from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';

import { BadgePill } from '@/components/ui/badge-pill';
import { Card, CardContent } from '@/components/ui/card';
import { vehicleAnalyticsQueryOptions } from '@/api/query-options';

export function VehicleAnalytics() {
  return (
    <React.Suspense fallback={<VehicleAnalyticsSkeleton />}>
      <VehicleAnalyticsContent />
    </React.Suspense>
  );
}

const routeApi = getRouteApi('/_auth/vehicles/$vehicleId');

function VehicleAnalyticsContent() {
  const { vehicleId } = routeApi.useParams();
  const { data: analytics } = useSuspenseQuery(
    vehicleAnalyticsQueryOptions({ vehicleId }),
  );

  const fuelAnalytics = [
    {
      label: 'Avg MPG',
      value: analytics.averageMpg > 0 ? analytics.averageMpg.toFixed(1) : '--',
    },
    {
      label: 'Best MPG',
      value: analytics.bestMpg ? analytics.bestMpg.toFixed(1) : '--',
    },
    {
      label: 'Lowest MPG',
      value: analytics.lowestMpg ? analytics.lowestMpg.toFixed(1) : '--',
    },
    {
      label: 'Total Miles',
      value:
        analytics.totalMilesTracked > 0
          ? analytics.totalMilesTracked.toLocaleString()
          : '--',
    },
    {
      label: 'Total Gallons',
      value:
        analytics.totalGallonsUsed > 0
          ? analytics.totalGallonsUsed.toFixed(1)
          : '--',
    },
    {
      label: 'Total Cost',
      value: `$${analytics.totalFuelCost.toFixed(2)}`,
    },
  ];

  const serviceAnalytics = [
    {
      label: 'Total Cost',
      value: `$${analytics.totalServiceCost.toFixed(2)}`,
    },
  ];

  return (
    <Card includeCornerAccents>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 md:divide-x md:divide-border">
          <div className="space-y-3 md:pr-6">
            <div className="flex items-center justify-between gap-2">
              <BadgePill className="border-indigo-400/30 bg-indigo-400/10 dark:bg-indigo-400/10">
                <div className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-pulse" />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground dark:text-indigo-400">
                  Fuel Analytics
                </span>
              </BadgePill>
              <span className="text-xs text-muted-foreground font-mono">
                {analytics.fuelLogCount}{' '}
                {analytics.fuelLogCount === 1 ? 'log' : 'logs'}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {fuelAnalytics.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="font-mono">
                    <div className="text-xl md:text-2xl font-bold uppercase tracking-tight">
                      {stat.value}
                    </div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="space-y-3 md:pl-6">
            <div className="flex items-center justify-between gap-2">
              <BadgePill className="border-violet-400/30 bg-violet-400/10 dark:bg-violet-400/10">
                <div className="w-1.5 h-1.5 bg-violet-600 dark:bg-violet-400 rounded-full animate-pulse" />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground dark:text-violet-400">
                  Service Analytics
                </span>
              </BadgePill>
              <span className="text-xs text-muted-foreground font-mono">
                {analytics.serviceLogCount}{' '}
                {analytics.serviceLogCount === 1 ? 'log' : 'logs'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {serviceAnalytics.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="font-mono">
                    <div className="text-xl md:text-2xl font-bold uppercase tracking-tight">
                      {stat.value}
                    </div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function VehicleAnalyticsSkeleton() {
  return (
    <Card includeCornerAccents>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 md:divide-x md:divide-border">
          {/* Fuel Analytics Skeleton */}
          <div className="space-y-3 md:pr-6">
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-indigo-400/30 bg-indigo-400/10">
                <div className="w-1.5 h-1.5 bg-muted rounded-full animate-pulse" />
                <div className="h-3 w-20 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-4 w-16 bg-muted rounded animate-pulse" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="font-mono">
                    <div className="h-7 md:h-8 w-20 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Service Analytics Skeleton */}
          <div className="space-y-3 md:pl-6">
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-violet-400/30 bg-violet-400/10">
                <div className="w-1.5 h-1.5 bg-muted rounded-full animate-pulse" />
                <div className="h-3 w-24 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-4 w-16 bg-muted rounded animate-pulse" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 1 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="font-mono">
                    <div className="h-7 md:h-8 w-20 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
