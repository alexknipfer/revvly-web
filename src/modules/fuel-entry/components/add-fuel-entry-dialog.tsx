import {
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { AddFuelEntryForm } from './forms/add-fuel-entry-form';
import { Dialog } from '@/components/ui/dialog';

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Fuel Entry</DialogTitle>
          <DialogDescription>Log your fuel fill-up details</DialogDescription>
        </DialogHeader>
        <AddFuelEntryForm onSuccess={onFuelEntryCreated} />
      </DialogContent>
    </Dialog>
  );
}
