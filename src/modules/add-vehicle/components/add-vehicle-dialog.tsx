import { z } from 'zod';
import { api } from 'convex/_generated/api';
import { useStore } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useConvexMutation } from '@convex-dev/react-query';
import { useServerFn } from '@tanstack/react-start';

import { getSupportedVehicleYears } from '@/lib/utils';
import { DrawerDialog } from '@/components/ui/dialog-drawer';
import { Button } from '@/components/ui/button';
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
    createUserVehicleMutation.mutate(data);
  };
  const yearItems = getSupportedVehicleYears().map((year) => ({
    value: year,
    label: year,
  }));
  const makeItems = vehicleMakes.map((make) => ({
    value: make.name,
    label: make.name,
  }));
  const modelItems = vehicleModels.map((model) => ({
    value: model.name,
    label: model.name,
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
              return isMobile ? (
                <field.FormNativeSelect
                  label="Year *"
                  emptyOptionLabel="Select a year"
                  items={yearItems}
                />
              ) : (
                <field.FormCombobox
                  label="Year *"
                  placeholder="Select a year"
                  items={yearItems}
                />
              );
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
              return isMobile ? (
                <field.FormNativeSelect
                  label="Make *"
                  emptyOptionLabel="Select a make"
                  disabled={selectedYear === ''}
                  items={makeItems}
                />
              ) : (
                <field.FormCombobox
                  label="Make *"
                  placeholder="Select a make"
                  items={makeItems}
                  disabled={selectedYear === ''}
                />
              );
            }}
          </form.AppField>
          <form.AppField name="model">
            {(field) => {
              return isMobile ? (
                <field.FormNativeSelect
                  label="Model *"
                  emptyOptionLabel="Select a model"
                  disabled={selectedMake === ''}
                  items={modelItems}
                />
              ) : (
                <field.FormCombobox
                  label="Model *"
                  placeholder="Select a model"
                  disabled={selectedMake === ''}
                  items={modelItems}
                />
              );
            }}
          </form.AppField>
          <form.AppField name="name">
            {(field) => <field.FormInput label="Name (Optional)" />}
          </form.AppField>
          <form.AppField name="plate">
            {(field) => <field.FormInput label="Plate *" />}
          </form.AppField>
          <Button type="submit" className="w-full">
            Add Vehicle
          </Button>
        </form.AppForm>
      </form>
    </DrawerDialog>
  );
}
