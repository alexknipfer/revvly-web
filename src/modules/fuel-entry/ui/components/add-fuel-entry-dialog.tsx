import { useEffect, useState } from 'react';
import { z } from 'zod';
import { api } from 'convex/_generated/api';
import { useForm, useStore } from '@tanstack/react-form';
import { Id } from 'convex/_generated/dataModel';

import { Combobox } from '@/components/ui/combobox';
import { DrawerDialog } from '@/components/ui/dialog-drawer';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { NearbyGasStationDialog } from './nearby-gas-station-dialog';
import { Loader2 } from 'lucide-react';
import { useGeoLocation } from '@/hooks/use-geo-location';
import { useMutation } from '@tanstack/react-query';
import { useConvexMutation } from '@convex-dev/react-query';

const fuelTypeSchema = z.enum(['regular', 'premium', 'diesel', 'e85']);
const fuelLevelSchema = z.enum(['full', 'partial']);

const formSchema = z.object({
  date: z.date(),
  odometer: z.number().min(0),
  costPerGallon: z.string().min(0),
  totalGallons: z.string().min(0),
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
    date: new Date(),
    odometer: 0,
    costPerGallon: '',
    totalGallons: '',
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

  const [gasStationDialogOpen, setGasStationDialogOpen] = useState(false);
  const [shouldOpenOnLocation, setShouldOpenOnLocation] = useState(false);

  const costPerGallon = useStore(
    form.store,
    (state) => state.values.costPerGallon,
  );
  const totalGallons = useStore(
    form.store,
    (state) => state.values.totalGallons,
  );

  const totalCost = parseFloat(costPerGallon) * parseFloat(totalGallons);

  useEffect(() => {
    if (!open) {
      form.reset();
      setGasStationDialogOpen(false);
      setShouldOpenOnLocation(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Open dialog when location becomes available after user request
  // This is a valid use case: synchronizing with external state (geolocation API)
  useEffect(() => {
    if (location && shouldOpenOnLocation) {
      setGasStationDialogOpen(true);
      setShouldOpenOnLocation(false);
    }
  }, [location, shouldOpenOnLocation]);

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
      date: data.date.toISOString(),
      odometer: data.odometer,
      costPerGallon: parseFloat(data.costPerGallon),
      totalGallons: parseFloat(data.totalGallons),
      type: data.type,
      level: data.level,
      location: data.location || undefined,
      vehicleId,
    });
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
          name="date"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid} className="col-span-2">
                <FieldLabel htmlFor={field.name}>Date & Time *</FieldLabel>
                <DateTimePicker
                  value={field.state.value}
                  onChange={(date) => field.handleChange(date)}
                  defaultValue={new Date()}
                  id={field.name}
                  aria-invalid={isInvalid}
                  showLabels={false}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
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
                  step="0.001"
                  value={field.state.value.toString()}
                  onChange={(e) =>
                    field.handleChange(parseFloat(e.target.value))
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
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
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
                    onClick={() => {
                      if (!location) {
                        setShouldOpenOnLocation(true);
                        requestLocation();
                      } else {
                        setGasStationDialogOpen(true);
                      }
                    }}
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
                  <NearbyGasStationDialog
                    open={gasStationDialogOpen}
                    onOpenChange={setGasStationDialogOpen}
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
