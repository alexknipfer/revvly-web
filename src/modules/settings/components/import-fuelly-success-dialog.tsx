import { AlertCircle, CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DrawerDialog } from '@/components/ui/dialog-drawer';

import { ImportFuellyDataServerFnResult } from '../server/server-fns';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: ImportFuellyDataServerFnResult;
}

export function ImportFuellySuccessDialog({
  open,
  onOpenChange,
  result,
}: Props) {
  return (
    <DrawerDialog
      title="Import Complete"
      description="Fuelly data has been imported"
      open={open}
      onOpenChange={onOpenChange}
      footerContent={
        <Button
          type="button"
          onClick={() => {
            onOpenChange(false);
          }}
          className="w-full"
        >
          Done
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
          <CheckCircle2 className="size-5" />
          <p className="font-medium">Import completed successfully</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Fuel Entries:</span>
            <span className="text-sm font-medium">
              {result.fuelEntriesImported} imported
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Services:</span>
            <span className="text-sm font-medium">
              {result.servicesImported} imported
            </span>
          </div>
        </div>

        {result.errors.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertCircle className="size-4" />
              <p className="text-sm font-medium">Warnings:</p>
            </div>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {result.errors.map((error, index) => (
                <p key={index} className="text-xs text-muted-foreground">
                  {error}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </DrawerDialog>
  );
}
