import { Pencil } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item';
import { EditFuelEntryDialog } from '@/modules/vehicle/ui/components/fuel-entry/edit-fuel-entry-dialog';
import { Doc } from 'convex/_generated/dataModel';

interface Props {
  fuelEntry: Doc<'fuel_entries'>;
}

export function VehicleFuelEntryTimelineItem({ fuelEntry }: Props) {
  const [editFuelEntryDialogOpen, setEditFuelEntryDialogOpen] = useState(false);

  const date = new Date(fuelEntry.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Item className="p-0">
      <ItemContent>
        <div className="flex items-center gap-2">
          <ItemTitle>{formattedDate}</ItemTitle>
          {fuelEntry.missedFuelup && (
            <Badge variant="outline" className="text-xs">
              Missed Fuel Up
            </Badge>
          )}
        </div>
        <ItemDescription>
          <span className="mr-2.5">
            {fuelEntry.totalGallons.toFixed(2)} gal
          </span>
          <span>${fuelEntry.totalCost.toFixed(2)}</span>
        </ItemDescription>
      </ItemContent>
      <ItemContent className="flex-none">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setEditFuelEntryDialogOpen(true)}
        >
          <Pencil className="size-4" />
        </Button>
      </ItemContent>

      <ItemContent className="flex-none">
        <div className="px-1.5 bg-secondary rounded-sm text-center py-1">
          <p className="font-semibold text-sm">
            {fuelEntry.mpg ? fuelEntry.mpg.toFixed(1) : '--'}
          </p>
          <p className="text-xs text-muted-foreground">MPG</p>
        </div>
      </ItemContent>
      <EditFuelEntryDialog
        open={editFuelEntryDialogOpen}
        onOpenChange={setEditFuelEntryDialogOpen}
        fuelEntryId={fuelEntry._id}
        onFuelEntryUpdated={() => {
          setEditFuelEntryDialogOpen(false);
        }}
      />
    </Item>
  );
}
