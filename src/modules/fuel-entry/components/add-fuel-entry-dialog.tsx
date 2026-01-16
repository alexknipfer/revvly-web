import { DrawerDialog } from '@/components/ui/dialog-drawer';

import { AddFuelEntryForm } from './forms/add-fuel-entry-form';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFuelEntryCreated?: () => void;
}

export function AddFuelEntryDialog({
  open,
  onOpenChange,
  onFuelEntryCreated,
}: Props) {
  return (
    <DrawerDialog
      title="Add Fuel Entry"
      description="Log your fuel fill-up details"
      open={open}
      onOpenChange={onOpenChange}
      hideHeaderOnMobile
    >
      <AddFuelEntryForm onSuccess={onFuelEntryCreated} />
    </DrawerDialog>
  );
}
