import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense, useMemo } from 'react';
import { Wrench, Pencil, Plus } from 'lucide-react';
import { getRouteApi, Link } from '@tanstack/react-router';

import { Timeline } from '@/components/timeline';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

import { Button } from '@/components/ui/button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item';
import { servicesOptions } from '@/api/query-options';

import { Doc } from 'convex/_generated/dataModel';

const routeApi = getRouteApi('/_auth/vehicles/$vehicleId');

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function ServiceTimeline() {
  return (
    <Suspense fallback={<ServiceTimelineSkeleton />}>
      <ServiceTimelineContent />
    </Suspense>
  );
}

function ServiceTimelineContent() {
  const { vehicleId } = routeApi.useParams();

  const { data: services } = useSuspenseQuery(servicesOptions(vehicleId));

  const timelineItems = useMemo(() => {
    return services.map((service) => ({
      icon: <Wrench className="size-4" />,
      content: <ServiceTimelineItem key={service._id} service={service} />,
    }));
  }, [services]);

  if (services.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Wrench />
          </EmptyMedia>
          <EmptyTitle>No Service Records Yet</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t added any service records yet. Get started by
            adding your first service.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            nativeButton={false}
            render={
              <Link
                to="/vehicles/$vehicleId/services/new"
                params={{ vehicleId }}
              >
                <Plus className="size-4" />
                Add Service
              </Link>
            }
          />
        </EmptyContent>
      </Empty>
    );
  }

  return <Timeline items={timelineItems} />;
}

function ServiceTimelineItem({ service }: { service: Doc<'services'> }) {
  const { vehicleId } = routeApi.useParams();

  const date = new Date(service.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Item className="p-0">
      <ItemContent>
        <ItemTitle>{formattedDate}</ItemTitle>
        <ItemDescription>{service.types.join(', ')}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button
          variant="ghost"
          size="icon"
          nativeButton={false}
          render={
            <Link
              to="/vehicles/$vehicleId/services/$serviceId/edit"
              params={{ vehicleId, serviceId: service._id }}
            >
              <Pencil className="size-4" />
            </Link>
          }
        />
        <div className="px-1.5 bg-secondary rounded-sm text-center py-1">
          <p className="font-semibold text-sm">
            {formatter.format(service.cost)}
          </p>
        </div>
      </ItemActions>
    </Item>
  );
}

function ServiceTimelineSkeleton() {
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
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
