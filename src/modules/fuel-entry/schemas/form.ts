import { z } from 'zod';

import { fuelLevelSchema, fuelTypeSchema } from '@/types/fuel-entry';

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

export const fuelEntryFormDefaultValues: FuelEntryFormFields = {
  date: new Date(),
  odometer: 0,
  costPerGallon: '',
  totalGallons: '',
  missedFuelup: false,
  type: 'Regular (Octane 87)',
  level: 'Full',
  location: '',
  notes: '',
};
