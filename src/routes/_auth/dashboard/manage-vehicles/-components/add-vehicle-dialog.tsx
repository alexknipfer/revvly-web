import { PlusIcon } from 'lucide-react';
import { z } from 'zod';
import { api } from 'convex/_generated/api';
import { useQuery } from 'convex/react';
import { useForm, useStore } from '@tanstack/react-form';

import { Combobox } from '@/components/ui/combobox';
import { getSupportedVehicleYears } from '@/lib/utils';
import { DrawerDialog } from '@/components/ui/dialog-drawer';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';

const formSchema = z.object({
  year: z.string(),
  make: z.string(),
});

export function AddVehicleDialog() {
  const form = useForm({
    defaultValues: {
      year: '',
      make: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => onSubmit(value),
  });
  const selectedYear = useStore(form.store, (state) => state.values.year);
  const data = useQuery(api.vehicles.getVehicleMakesByYear, {
    year: Number(selectedYear),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log('data: ', data);
  };

  return (
    <DrawerDialog
      title="Add Vehicle"
      description="Add your vehicle to begin tracking"
      trigger={
        <Button
          type="button"
          className="fixed bottom-5 right-5 rounded-full bg-blue-500 h-12 w-12 ring-1 ring-blue-700"
        >
          <PlusIcon className="text-white size-5" />
        </Button>
      }
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
                <FieldLabel htmlFor={field.name}>Year</FieldLabel>
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
                <FieldLabel htmlFor={field.name}>Make</FieldLabel>
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
      </form>
    </DrawerDialog>
  );
}
