import { zid } from 'convex-helpers/server/zod4';
import z from 'zod';

export type FuelType = z.infer<typeof fuelTypeSchema>;
export const fuelTypeSchema = z.enum(['regular', 'premium', 'diesel', 'e85']);

export type FuelLevel = z.infer<typeof fuelLevelSchema>;
export const fuelLevelSchema = z.enum(['full', 'partial']);

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
