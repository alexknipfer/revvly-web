import { z } from 'zod';
import { api } from 'convex/_generated/api';
import { useForm, useStore } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useConvexMutation } from '@convex-dev/react-query';
import { useServerFn } from '@tanstack/react-start';

import { Combobox } from '@/components/ui/combobox';
import { getSupportedVehicleYears } from '@/lib/utils';
import { DrawerDialog } from '@/components/ui/dialog-drawer';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import {
  getVehicleMakesServerFn,
  getVehicleModelsForMakeServerFn,
} from '../../server/server-fns';

const formSchema = z.object({
  year: z.string().min(1),
  make: z.string().min(1),
  model: z.string().min(1),
  name: z.string(),
  plate: z.string().min(1),
});

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVehicleCreated?: () => void;
}

export function AddVehicleDialog({
  open,
  onOpenChange,
  onVehicleCreated,
}: Props) {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      year: '',
      make: '',
      model: '',
      plate: '',
      name: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => onSubmit(value),
  });

  const selectedYear = useStore(form.store, (state) => state.values.year);
  const selectedMake = useStore(form.store, (state) => state.values.make);

  const getVehicleMakes = useServerFn(getVehicleMakesServerFn);
  const { data: vehicleMakes = [] } = useQuery({
    queryKey: ['vehicle-makes'],
    queryFn: getVehicleMakes,
  });
  const getVehicleModels = useServerFn(getVehicleModelsForMakeServerFn);
  const { data: vehicleModels = [] } = useQuery({
    queryKey: ['vehicle-models', selectedMake, selectedYear],
    queryFn: () =>
      getVehicleModels({ data: { make: selectedMake, year: selectedYear } }),
    enabled: !!selectedMake && !!selectedYear,
  });

  const convexCreateUserMutation = useConvexMutation(api.userVehicles.create);
  const createUserVehicleMutation = useMutation({
    mutationFn: convexCreateUserMutation,
    onSuccess: (newVehicleId) => {
      onVehicleCreated?.();
      navigate({
        to: '/vehicles/$vehicleId',
        params: { vehicleId: newVehicleId },
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createUserVehicleMutation.mutate(data);
  };

  return (
    <DrawerDialog
      title="Add Vehicle"
      description="Add your vehicle to begin tracking"
      open={open}
      onOpenChange={onOpenChange}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-5"
      >
        <form.Field
          name="year"
          listeners={{
            onChangeDebounceMs: 500,
            onChange: () => {
              form.setFieldValue('make', '');
              form.setFieldValue('model', '');
            },
          }}
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Year *</FieldLabel>
                <Combobox
                  label="Select Year"
                  items={getSupportedVehicleYears().map((year) => ({
                    value: year,
                    label: year,
                  }))}
                  value={field.state.value}
                  onChange={field.handleChange}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="make"
          listeners={{
            onChangeDebounceMs: 500,
            onChange: () => {
              form.setFieldValue('model', '');
            },
          }}
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Make *</FieldLabel>
                <Combobox
                  label="Select Make"
                  items={vehicleMakes.map((make) => ({
                    value: make.name,
                    label: make.name,
                  }))}
                  value={field.state.value}
                  onChange={field.handleChange}
                  disabled={selectedYear === ''}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="model"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Model *</FieldLabel>
                <Combobox
                  label="Select Model"
                  items={vehicleModels.map(({ name }) => ({
                    value: name,
                    label: name,
                  }))}
                  value={field.state.value}
                  onChange={field.handleChange}
                  disabled={selectedMake === ''}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="name"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Name (Optional)</FieldLabel>
                <Input
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
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
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <Button type="submit" className="w-full">
          Add Vehicle
        </Button>
      </form>
    </DrawerDialog>
  );
}
