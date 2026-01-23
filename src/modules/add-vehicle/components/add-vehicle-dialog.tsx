import { z } from 'zod';
import { api } from 'convex/_generated/api';
import { useForm, useStore } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useConvexMutation } from '@convex-dev/react-query';
import { useServerFn } from '@tanstack/react-start';

import {
  Combobox,
  ComboboxEmpty,
  ComboboxContent,
  ComboboxInput,
  ComboboxList,
  ComboboxItem,
} from '@/components/ui/combobox';
import { getSupportedVehicleYears } from '@/lib/utils';
import { DrawerDialog } from '@/components/ui/dialog-drawer';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { useMediaQuery } from '@/hooks/use-media-query';

import {
  getVehicleMakesServerFn,
  getVehicleModelsForMakeServerFn,
} from '../server/server-fns';
import { useAppForm } from '@/hooks/use-form';

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
  const isMobile = useMediaQuery('(max-width: 768px)');
  const form = useAppForm({
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
    enabled: !!selectedYear,
  });
  const getVehicleModels = useServerFn(getVehicleModelsForMakeServerFn);
  const { data: vehicleModels = [] } = useQuery({
    queryKey: ['vehicle-models', selectedMake, selectedYear],
    queryFn: () =>
      getVehicleModels({ data: { make: selectedMake, year: selectedYear } }),
    enabled: !!selectedMake && !!selectedYear,
  });

  const convexCreateUserMutation = useConvexMutation(api.vehicles.create);
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
    console.log('data:', data);
    // createUserVehicleMutation.mutate(data);
  };
  const yearItems = getSupportedVehicleYears().map((year) => ({
    value: year,
    label: year,
  }));
  const makeItems = vehicleMakes.map((make) => ({
    value: make.name,
    label: make.name,
  }));

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
        <form.AppForm>
          <form.AppField
            name="year"
            listeners={{
              onChangeDebounceMs: 500,
              onChange: () => {
                form.setFieldValue('make', '');
                form.setFieldValue('model', '');
              },
            }}
          >
            {(field) => {
              return <field.FormCombobox label="Year *" items={yearItems} />;
            }}
          </form.AppField>
          <form.AppField
            name="make"
            listeners={{
              onChangeDebounceMs: 500,
              onChange: () => {
                form.setFieldValue('model', '');
              },
            }}
          >
            {(field) => {
              return (
                <field.FormCombobox
                  label="Make *"
                  items={makeItems}
                  disabled={selectedYear === ''}
                />
              );
            }}
          </form.AppField>
          <form.Field
            name="model"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              const modelItems = vehicleModels.map(({ name }) => ({
                value: name,
                label: name,
              }));
              const isDisabled = selectedMake === '';

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Model *</FieldLabel>
                  {isMobile ? (
                    <NativeSelect
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isDisabled}
                      aria-invalid={isInvalid}
                      className="w-full"
                    >
                      <NativeSelectOption value="">
                        Select Model
                      </NativeSelectOption>
                      {modelItems.map((item) => (
                        <NativeSelectOption key={item.value} value={item.value}>
                          {item.label}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                  ) : (
                    <Combobox items={modelItems}>
                      <ComboboxInput
                        placeholder="Select Model"
                        disabled={isDisabled}
                      />
                      <ComboboxContent>
                        <ComboboxEmpty>No items found.</ComboboxEmpty>
                        <ComboboxList>
                          {(model) => (
                            <ComboboxItem key={model} value={model}>
                              {model}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  )}
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
        </form.AppForm>
      </form>
    </DrawerDialog>
  );
}
