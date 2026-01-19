import { DrawerDialog } from '@/components/ui/dialog-drawer';

import { AddServiceForm } from './forms/add-service-form';

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
    <DrawerDialog
      title="Add Service"
      description="Log vehicle maintenance and repairs"
      open={open}
      onOpenChange={onOpenChange}
      hideHeaderOnMobile
    >
      <AddServiceForm onSuccess={onServiceCreated} />
    </DrawerDialog>
  );
}
