import { z } from 'zod';
import { api } from 'convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { useForm, useStore } from '@tanstack/react-form';

import { Combobox } from '@/components/ui/combobox';
import { getSupportedVehicleYears } from '@/lib/utils';
import { DrawerDialog } from '@/components/ui/dialog-drawer';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

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

  const data = useQuery(
    api.vehicles.getMakesByYear,
    selectedYear
      ? {
          year: Number(selectedYear),
        }
      : 'skip',
  );
  const models = useQuery(
    api.vehicles.getModelsByYearAndMake,
    selectedYear && selectedMake
      ? {
          year: Number(selectedYear),
          make: selectedMake,
        }
      : 'skip',
  );
  const createUserVehicleMutation = useMutation(api.userVehicles.create);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createUserVehicleMutation(data);
    onVehicleCreated?.();
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
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Make *</FieldLabel>
                <Combobox
                  label="Select Make"
                  items={(data || []).map((make) => ({
                    value: make,
                    label: make,
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
                  items={(models || []).map((model) => ({
                    value: model,
                    label: model,
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
