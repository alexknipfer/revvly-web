import z from 'zod';
import { useConvexMutation } from '@convex-dev/react-query';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Loader } from 'lucide-react';

import { fuelEntryByIdQueryOptions } from '@/api/query-options';
import { Button } from '@/components/ui/button';
import { useAppForm } from '@/hooks/use-form';
import { FuelEntryFieldGroup } from '@/modules/fuel-entry/components/fuel-entry-field-group';
import { fuelLevelSchema, fuelTypeSchema } from '@/types/vehicles';
import { api } from 'convex/_generated/api';
import { Id } from 'convex/_generated/dataModel';

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
  fuelEntryId: Id<'fuel_entries'>;
  onSuccess?: () => void;
  fetchFuelEntryEnabled?: boolean;
}

export function EditFuelEntryForm({
  fuelEntryId,
  fetchFuelEntryEnabled,
  onSuccess,
}: Props) {
  const {
    data: fuelEntry,
    error,
    isPending,
  } = useQuery(
    fuelEntryByIdQueryOptions({
      id: fuelEntryId,
      enabled: fetchFuelEntryEnabled,
    }),
  );

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
      onSuccess?.();
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
      date: data.fuelEntryFields.date.toISOString(),
    });
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="size-4 animate-spin" />
      </div>
    );
  }

  if (error) {
    throw new Error('Failed to fetch fuel entry');
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="grid grid-cols-2 gap-4 overflow-y-auto"
    >
      <form.AppForm>
        <FuelEntryFieldGroup form={form} fields="fuelEntryFields" />
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
  );
}
