import { useMemo } from 'react';
import { convexQuery } from '@convex-dev/react-query';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { Fuel } from 'lucide-react';

import { Timeline, TimelineItem } from '@/components/timeline';
import { api } from 'convex/_generated/api';
import { Id } from 'convex/_generated/dataModel';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item';

const routeApi = getRouteApi('/_auth/vehicles/$vehicleId');

export function VehicleTimeline() {
  const { vehicleId } = routeApi.useParams();

  const { data: fuelEntries } = useSuspenseQuery(
    convexQuery(api.fuelEntries.getAll, {
      vehicleId: vehicleId as Id<'vehicles'>,
    }),
  );

  const timelineItems: Array<TimelineItem> = useMemo(() => {
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

  if (fuelEntries.length === 0) {
    return null;
  }

  return <Timeline items={timelineItems} />;
}
