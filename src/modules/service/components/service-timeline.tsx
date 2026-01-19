import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense, useMemo, useState } from 'react';
import { Wrench, Pencil } from 'lucide-react';
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
import { servicesOptions } from '@/api/query-options';
import { DrawerDialog } from '@/components/ui/dialog-drawer';

import { Doc } from 'convex/_generated/dataModel';

import { AddServiceDialog } from './add-service-dialog';
import { EditServiceForm } from './forms/edit-service-form';

const routeApi = getRouteApi('/_auth/vehicles/$vehicleId');

export function ServiceTimeline() {
  return (
    <Suspense fallback={<ServiceTimelineSkeleton />}>
      <ServiceTimelineContent />
    </Suspense>
  );
}

function ServiceTimelineContent() {
  const { vehicleId } = routeApi.useParams();
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);

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
          <Button onClick={() => setServiceDialogOpen(true)}>
            Add Service
          </Button>
          <AddServiceDialog
            open={serviceDialogOpen}
            onOpenChange={setServiceDialogOpen}
            onServiceCreated={() =>
              toast.success('Service record added successfully')
            }
          />
        </EmptyContent>
      </Empty>
    );
  }

  return <Timeline items={timelineItems} />;
}

function ServiceTimelineItem({ service }: { service: Doc<'services'> }) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const date = new Date(service.date);
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
            <Badge variant="outline" className="text-xs">
              {service.type}
            </Badge>
          </div>
          <ItemDescription>
            <span className="mr-2.5">${service.cost.toFixed(2)}</span>
            {service.location && (
              <span className="text-muted-foreground">{service.location}</span>
            )}
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
      </Item>
      <DrawerDialog
        title="Edit Service"
        description="Update your service record details"
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        hideHeaderOnMobile
      >
        <EditServiceForm
          serviceId={service._id}
          onSuccess={() => {
            toast.success('Service record updated successfully');
            setEditDialogOpen(false);
          }}
          fetchServiceEnabled={editDialogOpen}
        />
      </DrawerDialog>
    </>
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
