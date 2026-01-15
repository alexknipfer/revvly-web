import { z } from 'zod';
import { Loader } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useConvexMutation } from '@convex-dev/react-query';

import { api } from 'convex/_generated/api';
import { DrawerDialog } from '@/components/ui/dialog-drawer';
import { Button } from '@/components/ui/button';
import { useAppForm } from '@/modules/core/hooks/use-form';
import { FuelEntryFieldGroup } from './fuel-entry-field-group';
import { fuelTypeSchema, fuelLevelSchema } from '@/modules/core/types/vehicles';
import { Id } from 'convex/_generated/dataModel';
import { fuelEntryByIdQueryOptions } from '@/modules/vehicle/lib/query-options';

const formSchema = z.object({
  fuelEntryFields: z.object({
    date: z.date(),
    odometer: z.number().min(1, { message: 'Odometer is required' }),
    costPerGallon: z
      .string()
      .min(1, { message: 'Cost per gallon is required' }),
    totalGallons: z.string().min(1, { message: 'Total gallons is required' }),
    missedFuelup: z.boolean(),
    type: fuelTypeSchema,
    level: fuelLevelSchema,
    location: z.string(),
    notes: z.string(),
  }),
});

interface Props {
  open: boolean;
  fuelEntryId: Id<'fuel_entries'>;
  onOpenChange: (open: boolean) => void;
  onFuelEntryUpdated?: () => void;
}

export function EditFuelEntryDialog({
  open,
  fuelEntryId,
  onOpenChange,
  onFuelEntryUpdated,
}: Props) {
  const {
    data: fuelEntry,
    isPending,
    isError,
  } = useQuery(fuelEntryByIdQueryOptions({ id: fuelEntryId, enabled: open }));

  const form = useAppForm({
    defaultValues: {
      fuelEntryFields: {
        date: new Date(fuelEntry?.date ?? ''),
        odometer: fuelEntry?.odometer ?? 0,
        costPerGallon: fuelEntry?.costPerGallon.toString() ?? '',
        totalGallons: fuelEntry?.totalGallons.toString() ?? '',
        missedFuelup: fuelEntry?.missedFuelup ?? false,
        type: fuelEntry?.type as 'regular' | 'premium' | 'diesel' | 'e85',
        level: fuelEntry?.level ?? 'full',
        location: fuelEntry?.location ?? '',
        notes: fuelEntry?.notes ?? '',
      },
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => onSubmit(value),
  });

  const updateFuelEntryMutation = useMutation({
    mutationFn: useConvexMutation(api.fuelEntries.update),
    onSuccess: () => {
      onFuelEntryUpdated?.();
      onOpenChange(false);
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    updateFuelEntryMutation.mutate({
      id: fuelEntryId,
      odometer: data.fuelEntryFields.odometer,
      costPerGallon: parseFloat(data.fuelEntryFields.costPerGallon),
      totalGallons: parseFloat(data.fuelEntryFields.totalGallons),
      type: data.fuelEntryFields.type,
      level: data.fuelEntryFields.level,
      location: data.fuelEntryFields.location || undefined,
      notes: data.fuelEntryFields.notes || undefined,
      missedFuelup: data.fuelEntryFields.missedFuelup,
    });
  };

  if (isError) {
    throw new Error('Failed to load fuel entry');
  }

  return (
    <DrawerDialog
      title="Edit Fuel Entry"
      description="Update your fuel fill-up details"
      open={open}
      onOpenChange={onOpenChange}
      hideHeaderOnMobile
    >
      {isPending ? (
        <div className="flex items-center justify-center h-full">
          <Loader className="size-4 animate-spin" />
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="grid grid-cols-2 gap-4 overflow-y-auto"
        >
          <form.AppForm>
            <FuelEntryFieldGroup
              form={form}
              fields="fuelEntryFields"
              latestOdometer={fuelEntry.latestOdometer}
            />
            <form.Subscribe
              selector={(state) => state.isDirty}
              children={(isDirty) => (
                <Button
                  type="submit"
                  className="col-span-2"
                  disabled={updateFuelEntryMutation.isPending || !isDirty}
                >
                  {updateFuelEntryMutation.isPending
                    ? 'Updating...'
                    : 'Update Fuel Entry'}
                </Button>
              )}
            />
          </form.AppForm>
        </form>
      )}
    </DrawerDialog>
  );
}
