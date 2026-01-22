import { useState } from 'react';
import { useStore } from '@tanstack/react-form';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useGeoLocation } from '@/hooks/use-geo-location';
import { fuelTypeSchema, fuelLevelSchema } from '@/types/fuel-entry';
import { withFieldGroup, useFieldContext } from '@/hooks/use-form';

import { NearbyGasStationDialog } from './nearby-gas-station-dialog';
import { getRouteApi } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { vehicleByIdQueryOptions } from '@/api/query-options';

type FuelEntryFields = {
  date: Date;
  odometer: number;
  costPerGallon: string;
  totalGallons: string;
  missedFuelup: boolean;
  type: 'regular' | 'premium' | 'diesel' | 'e85';
  level: 'full' | 'partial';
  location: string;
  notes: string;
};

const defaultValues: FuelEntryFields = {
  date: new Date(),
  odometer: 0,
  costPerGallon: '',
  totalGallons: '',
  location: '',
  notes: '',
  type: 'regular',
  level: 'full',
  missedFuelup: false,
};

const fuelTypes = fuelTypeSchema.options.map((type) => ({
  value: type,
  label: type.charAt(0).toUpperCase() + type.slice(1),
}));

const fuelLevels = fuelLevelSchema.options.map((level) => ({
  value: level,
  label: level.charAt(0).toUpperCase() + level.slice(1),
}));

function LocationField() {
  const field = useFieldContext<string>();
  const [gasStationDialogOpen, setGasStationDialogOpen] = useState(false);

  const {
    location,
    requestLocation,
    loading,
    error: geoLocationError,
  } = useGeoLocation({
    onSuccess: () => {
      setGasStationDialogOpen(true);
    },
  });

  return (
    <Field className="col-span-2">
      <div className="flex items-center justify-between">
        <label htmlFor={field.name} className="text-sm font-medium">
          Location (Optional)
        </label>
        <Button
          type="button"
          variant="link"
          size="sm"
          onClick={() => {
            if (!location) {
              requestLocation();
            } else {
              setGasStationDialogOpen(true);
            }
          }}
        >
          <span className="text-xs">Find Nearby Gas Stations</span>
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        </Button>
      </div>
      <Input
        name={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {geoLocationError && (
        <div className="text-sm text-destructive">
          {geoLocationError.message}
        </div>
      )}
      {location && (
        <NearbyGasStationDialog
          open={gasStationDialogOpen}
          onOpenChange={setGasStationDialogOpen}
          userLocation={location}
          onSelect={(value) => {
            field.handleChange(
              value.displayName.text + ' - ' + value.formattedAddress,
            );
            setGasStationDialogOpen(false);
          }}
        />
      )}
    </Field>
  );
}

const routeApi = getRouteApi('/_auth/vehicles/$vehicleId');

export const FuelEntryFieldGroup = withFieldGroup({
  defaultValues,
  render: function Render({ group }) {
    const { vehicleId } = routeApi.useParams();
    const { data: vehicle } = useSuspenseQuery(
      vehicleByIdQueryOptions({ vehicleId }),
    );

    const costPerGallon = useStore(
      group.store,
      (state) => state.values.costPerGallon,
    );
    const totalGallons = useStore(
      group.store,
      (state) => state.values.totalGallons,
    );

    const totalCost =
      isNaN(parseFloat(costPerGallon)) || isNaN(parseFloat(totalGallons))
        ? 0
        : parseFloat(costPerGallon) * parseFloat(totalGallons);

    return (
      <>
        <group.AppField name="date">
          {(field) => (
            <field.FormDateTimePicker
              label="Date & Time *"
              showLabels={false}
            />
          )}
        </group.AppField>
        <group.AppField name="odometer">
          {(field) => (
            <field.FormNumberInput
              label="Odometer *"
              step="0.001"
              labelSuffix={
                vehicle.latestOdometer ? (
                  <span className="text-xs text-muted-foreground font-normal">
                    Latest: {vehicle.latestOdometer.toLocaleString()}
                  </span>
                ) : undefined
              }
            />
          )}
        </group.AppField>
        <group.AppField name="costPerGallon">
          {(field) => (
            <field.FormInput label="Cost per Gallon *" type="number" />
          )}
        </group.AppField>
        <group.AppField name="totalGallons">
          {(field) => <field.FormInput label="Total Gallons *" type="number" />}
        </group.AppField>
        <Field>
          <label htmlFor="totalCost" className="text-sm font-medium">
            Total Cost
          </label>
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
        <group.AppField name="missedFuelup">
          {(field) => (
            <field.FormCheckbox
              label="Missed Fuel Up"
              description="This will not calculate the MPG for this fuel entry."
              className="col-span-2"
            />
          )}
        </group.AppField>
        <group.AppField name="type">
          {(field) => (
            <field.FormNativeSelect label="Fuel Type *" items={fuelTypes} />
          )}
        </group.AppField>
        <group.AppField name="level">
          {(field) => (
            <field.FormNativeSelect label="Fill Level *" items={fuelLevels} />
          )}
        </group.AppField>
        <group.AppField name="location">
          {() => <LocationField />}
        </group.AppField>
        <group.AppField name="notes">
          {(field) => (
            <field.FormTextarea label="Notes" className="col-span-2" />
          )}
        </group.AppField>
      </>
    );
  },
});
