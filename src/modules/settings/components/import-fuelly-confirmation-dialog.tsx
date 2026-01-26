import { useState, useMemo, useCallback } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';

import { DrawerDialog } from '@/components/ui/dialog-drawer';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';

import {
  FuellyCsvPreviewServerFnResult,
  importFuellyDataServerFn,
} from '../server/server-fns';
import { getAllVehiclesQueryOptions } from '@/api/query-options';
import { getVehicleDisplayName } from '@/lib/utils';

import { ImportFuellySuccessDialog } from './import-fuelly-success-dialog';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  csvFile: File;
  csvPreview: FuellyCsvPreviewServerFnResult;
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
  const [mappings, setMappings] = useState<Record<string, string | null>>(
    () => {
      const mappings: Record<string, string | null> = {};

      for (const vehicle of csvPreview.vehicles) {
        mappings[vehicle.name] = null;
      }

      return mappings;
    },
  );

  const mappedVehicleIds = useMemo(() => {
    return new Set(
      Object.values(mappings).filter((v): v is string => Boolean(v)),
    );
  }, [mappings]);

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
      setMappings((prev) => ({
        ...prev,
        [fuellyVehicleName]: vehicleId,
      }));
    },
    [],
  );

  const handleImport = () => {
    const formData = new FormData();
    formData.append('file', csvFile);
    formData.append('mappings', JSON.stringify(mappings));

    importMutation({ data: formData });
  };

  const mappedCount = Object.values(mappings).filter((v) => Boolean(v)).length;
  const canImport = mappedCount > 0 && !isImporting;

  const totalEntriesToImport = Object.entries(mappings).reduce(
    (sum, [fuellyVehicleName, vehicleId]) => {
      const vehicle = csvPreview.vehicles.find(
        (v) => v.name === fuellyVehicleName,
      );
      if (vehicle && vehicleId) {
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
            const selectedVehicleId = mappings[vehicle.name] || '';
            const selectableVehicles = userVehicles.filter(
              (userVehicle) =>
                userVehicle._id === selectedVehicleId ||
                !mappedVehicleIds.has(userVehicle._id),
            );

            return (
              <Field key={vehicle.name}>
                <FieldLabel>
                  {vehicle.name}
                  <span className="text-xs text-muted-foreground ml-2">
                    ({vehicle.fuelEntryCount} fuel entries,{' '}
                    {vehicle.serviceCount} services)
                  </span>
                </FieldLabel>
                <NativeSelect
                  value={selectedVehicleId}
                  onChange={(e) => {
                    const nextValue = e.target.value;
                    handleMappingChange(
                      vehicle.name,
                      nextValue === '' ? null : nextValue,
                    );
                  }}
                >
                  <NativeSelectOption value="">
                    Select vehicle or skip
                  </NativeSelectOption>
                  {selectableVehicles.map((vehicle) => (
                    <NativeSelectOption key={vehicle._id} value={vehicle._id}>
                      {getVehicleDisplayName(vehicle)}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
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
