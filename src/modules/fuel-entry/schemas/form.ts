import { z } from 'zod';

import {
  FuelLevel,
  fuelTypeSchema,
  FuelType,
  fuelLevelSchema,
} from '@/types/fuel-entry';
import { Doc } from 'convex/_generated/dataModel';
import { defaultTo } from '@/lib/utils';

export const fuelEntryFormSchema = z.object({
  date: z.date(),
  odometer: z.number().min(1, { message: 'Odometer is required' }),
  costPerGallon: z.string().min(1, { message: 'Cost per gallon is required' }),
  totalGallons: z.string().min(1, { message: 'Total gallons is required' }),
  missedFuelup: z.boolean(),
  type: fuelTypeSchema,
  level: fuelLevelSchema,
  location: z.string(),
  notes: z.string(),
});

export type FuelEntryFormFields = z.infer<typeof fuelEntryFormSchema>;

export function getFuelEntryFormDefaultValues({
  fuelEntry,
  vehicle,
}: {
  vehicle?: Doc<'vehicles'>;
  fuelEntry?: Doc<'fuel_entries'>;
} = {}): FuelEntryFormFields {
  return {
    date: fuelEntry ? new Date(fuelEntry.date) : new Date(),
    odometer: fuelEntry ? fuelEntry.odometer : 0,
    costPerGallon: fuelEntry ? fuelEntry.costPerGallon.toString() : '',
    totalGallons: fuelEntry ? fuelEntry.totalGallons.toString() : '',
    missedFuelup: fuelEntry ? fuelEntry.missedFuelup : false,
    type: fuelEntry
      ? (fuelEntry.type as FuelType)
      : vehicle
        ? (defaultTo(
            vehicle.defaultFuelType,
            'Regular (Octane 87)',
          ) as FuelType)
        : 'Regular (Octane 87)',
    level: (fuelEntry ? (fuelEntry.level as FuelLevel) : 'Full') || 'Full',
    location: defaultTo(fuelEntry?.location, ''),
    notes: defaultTo(fuelEntry?.notes, ''),
  };
}
