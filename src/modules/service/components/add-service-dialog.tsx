import { AddServiceForm } from './forms/add-service-form';
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onServiceCreated?: () => void;
}

export function AddServiceDialog({
  open,
  onOpenChange,
  onServiceCreated,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Service</DialogTitle>
          <DialogDescription>
            Log vehicle maintenance and repairs
          </DialogDescription>
        </DialogHeader>
        <AddServiceForm onSuccess={onServiceCreated} />
      </DialogContent>
    </Dialog>
  );
}
