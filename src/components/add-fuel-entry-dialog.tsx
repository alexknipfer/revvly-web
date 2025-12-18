import { useEffect } from 'react';
import { z } from 'zod';
import { api } from 'convex/_generated/api';
import { useMutation } from 'convex/react';
import { useForm, useStore } from '@tanstack/react-form';
import { Id } from 'convex/_generated/dataModel';

import { Combobox } from '@/components/ui/combobox';
import { DrawerDialog } from '@/components/ui/dialog-drawer';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { GasStationSelector } from './gas-station-selector';
import { Loader2 } from 'lucide-react';
import { useGeoLocation } from '@/hooks/use-geo-location';

const fuelTypeSchema = z.enum(['regular', 'premium', 'diesel', 'e85']);
const fuelLevelSchema = z.enum(['full', 'partial']);

const formSchema = z.object({
  odometer: z.number().min(0),
  costPerGallon: z.number().min(0),
  totalGallons: z.number().min(0),
  type: fuelTypeSchema,
  level: fuelLevelSchema,
  location: z.string(),
});

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleId: Id<'vehicles'>;
  onFuelEntryCreated?: () => void;
}

const fuelTypes = fuelTypeSchema.options.map((type) => ({
  value: type,
  label: type.charAt(0).toUpperCase() + type.slice(1),
}));

const fuelLevels = fuelLevelSchema.options.map((level) => ({
  value: level,
  label: level.charAt(0).toUpperCase() + level.slice(1),
}));

export function AddFuelEntryDialog({
  open,
  onOpenChange,
  vehicleId,
  onFuelEntryCreated,
}: Props) {
  const defaultValues: z.infer<typeof formSchema> = {
    odometer: 0,
    costPerGallon: 0,
    totalGallons: 0,
    location: '',
    type: 'regular',
    level: 'full',
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => onSubmit(value),
  });

  const {
    location,
    requestLocation,
    loading,
    error: geoLocationError,
  } = useGeoLocation();

  const costPerGallon = useStore(
    form.store,
    (state) => state.values.costPerGallon,
  );
  const totalGallons = useStore(
    form.store,
    (state) => state.values.totalGallons,
  );

  const totalCost = costPerGallon * totalGallons;

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const createFuelEntryMutation = useMutation(api.fuelEntries.create);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await createFuelEntryMutation({
      odometer: data.odometer,
      costPerGallon: data.costPerGallon,
      totalGallons: data.totalGallons,
      type: data.type,
      level: data.level,
      location: data.location || undefined,
      vehicleId,
    });
    onFuelEntryCreated?.();
    onOpenChange(false);
    form.reset();
  };

  return (
    <DrawerDialog
      title="Add Fuel Entry"
      description="Log your fuel fill-up details"
      open={open}
      onOpenChange={onOpenChange}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="grid grid-cols-2 gap-4 overflow-y-auto"
      >
        <form.Field
          name="odometer"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Odometer *</FieldLabel>
                <Input
                  name={field.name}
                  type="number"
                  step="0.1"
                  value={field.state.value.toString()}
                  onChange={(e) =>
                    field.handleChange(parseFloat(e.target.value) || 0)
                  }
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="costPerGallon"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Cost per Gallon *</FieldLabel>
                <Input
                  name={field.name}
                  type="number"
                  step="0.01"
                  value={field.state.value.toString()}
                  onChange={(e) =>
                    field.handleChange(parseFloat(e.target.value) || 0)
                  }
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="totalGallons"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Total Gallons *</FieldLabel>
                <Input
                  name={field.name}
                  type="number"
                  step="0.01"
                  value={field.state.value.toString()}
                  onChange={(e) =>
                    field.handleChange(parseFloat(e.target.value) || 0)
                  }
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <Field>
          <FieldLabel htmlFor="totalCost">Total Cost</FieldLabel>
          <Input
            name="totalCost"
            type="number"
            step="0.01"
            value={totalCost.toFixed(2)}
            disabled
            className="bg-muted"
            readOnly
          />
        </Field>

        <form.Field
          name="type"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Fuel Type *</FieldLabel>
                <Combobox
                  label="Select Fuel Type"
                  items={fuelTypes}
                  value={field.state.value}
                  onChange={(value) =>
                    field.handleChange(
                      value as 'regular' | 'premium' | 'diesel' | 'e85',
                    )
                  }
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="level"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Fill Level *</FieldLabel>
                <Combobox
                  label="Select Fill Level"
                  items={fuelLevels}
                  value={field.state.value}
                  onChange={(value) =>
                    field.handleChange(value as 'full' | 'partial')
                  }
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="location"
          children={(field) => {
            return (
              <Field className="col-span-2">
                <FieldLabel
                  htmlFor={field.name}
                  className="flex items-center justify-between"
                >
                  Location (Optional)
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={requestLocation}
                  >
                    <span className="text-xs">Find Nearby Gas Stations</span>
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  </Button>
                </FieldLabel>
                <Input
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {geoLocationError && (
                  <FieldError
                    errors={[{ message: geoLocationError.message }]}
                  />
                )}
                {location && (
                  <GasStationSelector
                    value={field.state.value}
                    geolocation={location}
                    onChange={field.handleChange}
                  />
                )}
              </Field>
            );
          }}
        />
        <Button type="submit" className="w-full">
          Add Fuel Entry
        </Button>
      </form>
    </DrawerDialog>
  );
}
