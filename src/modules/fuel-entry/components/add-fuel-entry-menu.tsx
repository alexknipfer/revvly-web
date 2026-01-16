import { Fuel, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { AddFuelEntryDialog } from './add-fuel-entry-dialog';

export function AddFuelEntryMenu() {
  const [fuelEntryDialogOpen, setFuelEntryDialogOpen] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="shrink-0">
          <Plus className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => setFuelEntryDialogOpen(true)}>
          <Fuel className="size-4" />
          Fuel Entry
        </DropdownMenuItem>
      </DropdownMenuContent>
      <AddFuelEntryDialog
        open={fuelEntryDialogOpen}
        onOpenChange={setFuelEntryDialogOpen}
        onFuelEntryCreated={() =>
          toast.success('Fuel entry added successfully')
        }
      />
    </DropdownMenu>
  );
}
