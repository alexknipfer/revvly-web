import z from 'zod';
import { useConvexMutation } from '@convex-dev/react-query';
import { useMutation } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';

import { useAppForm } from '@/hooks/use-form';
import { api } from 'convex/_generated/api';
import { defaultTo } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Id } from 'convex/_generated/dataModel';

import { FuelEntryFieldGroup } from '../fuel-entry-field-group';
import { UploadReceiptDialog } from '../upload-receipt-dialog';
import {
  fuelEntryFormDefaultValues,
  fuelEntryFormSchema,
} from '../../schemas/form';

const formSchema = z.object({
  fuelEntryFields: fuelEntryFormSchema,
});

const routeApi = getRouteApi('/_auth/vehicles/$vehicleId');

interface Props {
  onSuccess?: () => void;
}

export function AddFuelEntryForm({ onSuccess }: Props) {
  const { vehicleId } = routeApi.useParams();
  const form = useAppForm({
    defaultValues: {
      fuelEntryFields: fuelEntryFormDefaultValues,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => onSubmit(value),
  });

  const createFuelEntryMutation = useMutation({
    mutationFn: useConvexMutation(api.fuelEntries.create),
    onSuccess: () => {
      onSuccess?.();
      form.reset();
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    createFuelEntryMutation.mutate({
      date: data.fuelEntryFields.date.toISOString(),
      odometer: data.fuelEntryFields.odometer,
      costPerGallon: parseFloat(data.fuelEntryFields.costPerGallon),
      totalGallons: parseFloat(data.fuelEntryFields.totalGallons),
      type: data.fuelEntryFields.type,
      level: data.fuelEntryFields.level,
      location: data.fuelEntryFields.location || undefined,
      vehicleId: vehicleId as Id<'vehicles'>,
      missedFuelup: data.fuelEntryFields.missedFuelup,
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="grid grid-cols-2 gap-4"
    >
      <form.AppForm>
        <div className="col-span-2 flex items-center justify-center py-2 border-b border-border">
          <UploadReceiptDialog
            onComplete={(data) => {
              form.setFieldValue(
                'fuelEntryFields.costPerGallon',
                defaultTo(data.costPerGallon?.toString(), ''),
              );
              form.setFieldValue(
                'fuelEntryFields.totalGallons',
                defaultTo(data.totalGallons?.toString(), ''),
              );
              form.setFieldValue(
                'fuelEntryFields.location',
                defaultTo(data.gasStation, ''),
              );

              if (data.typeOfFuel) {
                form.setFieldValue(
                  'fuelEntryFields.type',
                  data.typeOfFuel as 'regular' | 'premium' | 'diesel' | 'e85',
                );
              }
            }}
          />
        </div>
        <FuelEntryFieldGroup form={form} fields="fuelEntryFields" />
        <Button
          variant="secondary"
          onClick={() => window.history.back()}
          className="col-span-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="col-span-1"
          disabled={createFuelEntryMutation.isPending}
        >
          {createFuelEntryMutation.isPending ? 'Adding...' : 'Add Fuel Entry'}
        </Button>
      </form.AppForm>
    </form>
  );
}
