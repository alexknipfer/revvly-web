import { useForm } from '@tanstack/react-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useConvexMutation } from '@convex-dev/react-query';

import { DrawerDialog } from '@/components/ui/dialog-drawer';
import z from 'zod';
import { api } from 'convex/_generated/api';
import { Id } from 'convex/_generated/dataModel';
import { defaultTo } from '@/lib/utils';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { vehicleByIdQueryOptions } from '@/api/query-options';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const routeApi = getRouteApi('/_auth/vehicles/$vehicleId');

const formSchema = z.object({
  name: z.string(),
  plate: z.string().min(1),
});

export function EditVehicleDialog({ open, onOpenChange, onSuccess }: Props) {
  const { vehicleId } = routeApi.useParams();

  const { data: vehicle } = useQuery(vehicleByIdQueryOptions({ vehicleId }));

  const form = useForm({
    defaultValues: {
      name: defaultTo(vehicle?.name, ''),
      plate: defaultTo(vehicle?.plate, ''),
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
        <form.Field
          name="name"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="plate"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Plate *</FieldLabel>
                <Input
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
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
      </form>
    </DrawerDialog>
  );
}
