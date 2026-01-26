import { useState, useMemo, useCallback } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';

import { DrawerDialog } from '@/components/ui/dialog-drawer';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import {
  Combobox,
  ComboboxEmpty,
  ComboboxContent,
  ComboboxInput,
  ComboboxList,
  ComboboxItem,
} from '@/components/ui/combobox';

import type { FuellyCsvPreview, VehicleMapping } from '../types';
import { importFuellyDataServerFn } from '../server/server-fns';
import { getAllVehiclesQueryOptions } from '@/api/query-options';
import { getVehicleDisplayName } from '@/lib/utils';

import { ImportFuellySuccessDialog } from './import-fuelly-success-dialog';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  csvFile: File;
  csvPreview: FuellyCsvPreview;
  onImportComplete?: () => void;
}

export function ImportFuellyConfirmationDialog({
  open,
  onOpenChange,
  csvFile,
  csvPreview,
  onImportComplete,
}: Props) {
  const { data: userVehicles } = useSuspenseQuery(getAllVehiclesQueryOptions());

  const [mappings, setMappings] = useState<VehicleMapping[]>(() =>
    csvPreview.vehicles.map((v) => ({
      fuellyVehicleName: v.name,
      vehicleId: null,
    })),
  );

  const vehicleItems = useMemo(
    () => userVehicles.map(getVehicleDisplayName),
    [userVehicles],
  );

  const importData = useServerFn(importFuellyDataServerFn);
  const {
    mutate: importMutation,
    isPending: isImporting,
    data: importResult,
  } = useMutation({
    mutationFn: importData,
    onSuccess: () => {
      onImportComplete?.();
    },
  });

  const handleMappingChange = useCallback(
    (fuellyVehicleName: string, vehicleId: string | null) => {
      setMappings((prev) =>
        prev.map((m) =>
          m.fuellyVehicleName === fuellyVehicleName ? { ...m, vehicleId } : m,
        ),
      );
    },
    [],
  );

  const handleImport = () => {
    const formData = new FormData();
    formData.append('file', csvFile);
    formData.append('mappings', JSON.stringify(mappings));

    importMutation({ data: formData });
  };

  const mappedCount = mappings.filter((m) => m.vehicleId !== null).length;
  const canImport = mappedCount > 0 && !isImporting;

  const totalEntriesToImport = mappings.reduce(
    (sum, mapping) => {
      const vehicle = csvPreview.vehicles.find(
        (v) => v.name === mapping.fuellyVehicleName,
      );
      if (vehicle && mapping.vehicleId) {
        return {
          fuelEntries: sum.fuelEntries + vehicle.fuelEntryCount,
          services: sum.services + vehicle.serviceCount,
        };
      }
      return sum;
    },
    { fuelEntries: 0, services: 0 },
  );

  if (importResult) {
    return (
      <ImportFuellySuccessDialog
        open={open}
        onOpenChange={onOpenChange}
        result={importResult}
      />
    );
  }

  return (
    <DrawerDialog
      title="Map Vehicles"
      description="Select which vehicles in your account correspond to each Fuelly vehicle"
      open={open}
      onOpenChange={onOpenChange}
      footerContent={
        <div className="flex gap-2 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
            disabled={isImporting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleImport}
            disabled={!canImport}
            loading={isImporting}
            className="flex-1"
          >
            {isImporting ? 'Importing...' : 'Import Data'}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="space-y-4">
          {csvPreview.vehicles.map((vehicle) => {
            const mapping = mappings.find(
              (m) => m.fuellyVehicleName === vehicle.name,
            );
            const selectedVehicle = userVehicles.find(
              (v: (typeof userVehicles)[number]) =>
                v._id === mapping?.vehicleId,
            );
            const selectedValue = selectedVehicle
              ? selectedVehicle.name ||
                `${selectedVehicle.make} ${selectedVehicle.model} ${selectedVehicle.year}`
              : '';

            return (
              <Field key={vehicle.name}>
                <FieldLabel>
                  {vehicle.name}
                  <span className="text-xs text-muted-foreground ml-2">
                    ({vehicle.fuelEntryCount} fuel entries,{' '}
                    {vehicle.serviceCount} services)
                  </span>
                </FieldLabel>
                <Combobox
                  items={vehicleItems}
                  value={selectedValue}
                  onValueChange={(value) => {
                    // Prevent infinite loop by checking if value actually changed
                    const newSelected = !value
                      ? null
                      : userVehicles.find(
                          (v) => getVehicleDisplayName(v) === value,
                        );
                    const newVehicleId = newSelected?._id || null;

                    if (mapping?.vehicleId !== newVehicleId) {
                      handleMappingChange(vehicle.name, newVehicleId);
                    }
                  }}
                >
                  <ComboboxInput placeholder="Select vehicle or skip" />
                  <ComboboxContent>
                    <ComboboxEmpty>No vehicles found</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item} value={item}>
                          {item}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </Field>
            );
          })}
        </div>

        <div className="border-t pt-4 space-y-2">
          <p className="text-sm font-medium">Import Summary</p>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Vehicles mapped:</span>
              <span className="font-medium text-foreground">
                {mappedCount} of {csvPreview.vehicles.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Fuel entries to import:</span>
              <span className="font-medium text-foreground">
                {totalEntriesToImport.fuelEntries}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Services to import:</span>
              <span className="font-medium text-foreground">
                {totalEntriesToImport.services}
              </span>
            </div>
          </div>
        </div>
      </div>
    </DrawerDialog>
  );
}
