import z from 'zod';
import { useConvexMutation } from '@convex-dev/react-query';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';

import { fuelEntryByIdQueryOptions } from '@/api/query-options';
import { Button } from '@/components/ui/button';
import { useAppForm } from '@/hooks/use-form';
import { FuelEntryFieldGroup } from '@/modules/fuel-entry/components/fuel-entry-field-group';
import { api } from 'convex/_generated/api';
import { defaultTo } from '@/lib/utils';

import { fuelEntryFormSchema } from '../../schemas/form';

const formSchema = z.object({
  fuelEntryFields: fuelEntryFormSchema,
});

interface Props {
  onSuccess?: () => void;
}

const routeApi = getRouteApi(
  '/_auth/vehicles/$vehicleId/fuelentry/$fuelEntryId/edit',
);

export function EditFuelEntryForm({ onSuccess }: Props) {
  const { vehicleId, fuelEntryId } = routeApi.useParams();
  const { data: fuelEntry } = useSuspenseQuery(
    fuelEntryByIdQueryOptions(fuelEntryId),
  );

  const form = useAppForm({
    defaultValues: {
      fuelEntryFields: {
        date: new Date(fuelEntry.date),
        odometer: fuelEntry.odometer,
        costPerGallon: fuelEntry.costPerGallon.toString(),
        totalGallons: fuelEntry.totalGallons.toString(),
        missedFuelup: fuelEntry.missedFuelup,
        type: fuelEntry.type as 'regular' | 'premium' | 'diesel' | 'e85',
        level: fuelEntry.level as 'full' | 'partial',
        location: defaultTo(fuelEntry.location, ''),
        notes: defaultTo(fuelEntry.notes, ''),
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
      vehicleId,
    });
  };

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
        <Button
          variant="secondary"
          onClick={() => window.history.back()}
          className="col-span-1"
        >
          Cancel
        </Button>
        <form.Subscribe
          selector={(state) => state.isDirty}
          children={(isDirty) => (
            <Button
              type="submit"
              className="col-span-1"
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
