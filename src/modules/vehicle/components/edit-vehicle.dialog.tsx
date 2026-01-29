import z from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useConvexMutation } from '@convex-dev/react-query';

import { DrawerDialog } from '@/components/ui/dialog-drawer';
import { api } from 'convex/_generated/api';
import { Id } from 'convex/_generated/dataModel';
import { defaultTo } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { vehicleByIdQueryOptions } from '@/api/query-options';
import { useAppForm } from '@/hooks/use-form';
import { FuelType, fuelTypeSchema } from '@/types/fuel-entry';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const routeApi = getRouteApi('/_auth/vehicles/$vehicleId');

const formSchema = z.object({
  name: z.string(),
  plate: z.string().min(1),
  defaultFuelType: fuelTypeSchema,
});

export function EditVehicleDialog({ open, onOpenChange, onSuccess }: Props) {
  const { vehicleId } = routeApi.useParams();

  const { data: vehicle } = useQuery(vehicleByIdQueryOptions({ vehicleId }));

  const form = useAppForm({
    defaultValues: {
      name: defaultTo(vehicle?.name, ''),
      plate: defaultTo(vehicle?.plate, ''),
      defaultFuelType: defaultTo(vehicle?.defaultFuelType, '') as FuelType,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => onSubmit(value),
  });

  const convexUpdateUserVehicleMutation = useConvexMutation(
    api.vehicles.update,
  );
  const updateVehicleMutation = useMutation({
    mutationFn: convexUpdateUserVehicleMutation,
    onSuccess: () => {
      onSuccess?.();
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updateVehicleMutation.mutate({
      id: vehicleId as Id<'vehicles'>,
      update: data,
    });
  };

  return (
    <DrawerDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Vehicle"
      description="Edit your vehicle details"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-5"
      >
        <form.AppForm>
          <form.AppField name="name">
            {(field) => <field.FormInput label="Name" />}
          </form.AppField>
          <form.AppField name="plate">
            {(field) => <field.FormInput label="Plate" />}
          </form.AppField>
          <form.AppField name="defaultFuelType">
            {(field) => (
              <field.FormNativeSelect
                label="Default Fuel Type"
                description="This will be the default fuel type for new fuel entries."
                items={fuelTypeSchema.options.map((option) => ({
                  value: option,
                  label: option,
                }))}
              />
            )}
          </form.AppField>
          <div className="flex justify-end gap-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Update Vehicle</Button>
          </div>
        </form.AppForm>
      </form>
    </DrawerDialog>
  );
}
