import { z } from 'zod';
import { api } from 'convex/_generated/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useConvexMutation } from '@convex-dev/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { Id } from 'convex/_generated/dataModel';

import { DrawerDialog } from '@/components/ui/dialog-drawer';
import { Button } from '@/components/ui/button';

import { vehicleByIdQueryOptions } from '../../../lib/query-options';
import { fuelTypeSchema, fuelLevelSchema } from '@/modules/core/types/vehicles';
import { defaultTo } from '@/modules/core/lib/utils';
import { useAppForm } from '@/modules/core/hooks/use-form';
import { FuelEntryFieldGroup } from './fuel-entry-field-group';
import { UploadReceiptDialog } from '@/modules/vehicle/ui/components/fuel-entry/upload-receipt-dialog';

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
  onOpenChange: (open: boolean) => void;
  onFuelEntryCreated?: () => void;
}

const routeApi = getRouteApi('/_auth/vehicles/$vehicleId');

export function AddFuelEntryDialog({
  open,
  onOpenChange,
  onFuelEntryCreated,
}: Props) {
  const { vehicleId } = routeApi.useParams();
  const { data: vehicle } = useQuery(vehicleByIdQueryOptions({ vehicleId }));

  if (!vehicle) {
    throw new Error('Vehicle not found');
  }

  const form = useAppForm({
    defaultValues: {
      fuelEntryFields: {
        date: new Date(),
        odometer: 0,
        costPerGallon: '',
        totalGallons: '',
        location: '',
        notes: '',
        type: 'regular' as 'regular' | 'premium' | 'diesel' | 'e85',
        level: 'full' as 'full' | 'partial',
        missedFuelup: false,
      },
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => onSubmit(value),
  });

  const createFuelEntryMutation = useMutation({
    mutationFn: useConvexMutation(api.fuelEntries.create),
    onSuccess: () => {
      onFuelEntryCreated?.();
      onOpenChange(false);
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
    <DrawerDialog
      title="Add Fuel Entry"
      description="Log your fuel fill-up details"
      open={open}
      onOpenChange={onOpenChange}
      hideHeaderOnMobile
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="grid grid-cols-2 gap-4 overflow-y-auto"
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
          <FuelEntryFieldGroup
            form={form}
            latestOdometer={vehicle.latestOdometer}
            fields="fuelEntryFields"
          />
          <Button
            type="submit"
            className="col-span-2"
            disabled={createFuelEntryMutation.isPending}
          >
            {createFuelEntryMutation.isPending ? 'Adding...' : 'Add Fuel Entry'}
          </Button>
        </form.AppForm>
      </form>
    </DrawerDialog>
  );
}
