import { zid } from 'convex-helpers/server/zod4';
import z from 'zod';

export type FuelType = z.infer<typeof fuelTypeSchema>;
export const fuelTypeSchema = z.enum([
  'Low (Octane 85)',
  'Low (Octane 86)',
  'Regular (Octane 87)',
  'Mid (Octane 88)',
  'Mid (Octane 89)',
  'High (Octane 90)',
  'Premium (Octane 91)',
  'Premium (Octane 92)',
  'Premium (Octane 93)',
  'Super (Octane 94)',
  'Super (Octane 95)',
  'Super (Octane 98)',
  'Diesel 4D',
  'Diesel Synthetic',
  'Diesel 2D (Cetane 40)',
  'Diesel 1D (Cetane 44)',
  'Diesel ULSD (Cetane 45)',
  'E10',
  'E15',
  'E22',
  'E30',
  'E50',
  'E85',
  'E93',
  'E100',
  'B99',
  'B100',
  'Blend B2',
  'Blend B5',
  'Blend B20 (Cetane 50)',
  'Autogas/LPG',
  'CNG',
]);

export type FuelLevel = z.infer<typeof fuelLevelSchema>;
export const fuelLevelSchema = z.enum(['Partial', 'Full']);

export const fuellyFuelEntryImportSchema = z.object({
  date: z.string(),
  odometer: z.number(),
  costPerGallon: z.number(),
  totalGallons: z.number(),
  totalCost: z.number(),
  totalMiles: z.number(),
  mpg: z.number().optional(),
  type: fuelTypeSchema,
  level: fuelLevelSchema,
  location: z.string().optional(),
  notes: z.string().optional(),
  vehicleId: zid('vehicles'),
  missedFuelup: z.boolean(),
});
export type FuellyFuelEntryImport = z.infer<typeof fuellyFuelEntryImportSchema>;

export const fuellyServiceImportSchema = z.object({
  date: z.string(),
  odometer: z.number(),
  cost: z.number(),
  location: z.string().optional(),
  types: z.array(z.string().min(1)),
  notes: z.string().optional(),
  vehicleId: zid('vehicles'),
});
export type FuellyServiceImport = z.infer<typeof fuellyServiceImportSchema>;
