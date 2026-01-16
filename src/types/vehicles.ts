import z from 'zod';

import { Doc } from 'convex/_generated/dataModel';

export type VehicleWithImage = Doc<'vehicles'> & {
  imageUrl: string | null;
};

export type VehicleWithStats = Doc<'vehicles'> & {
  totalMilesTracked: number;
  totalGallonsUsed: number;
  averageMpg: number;
};

export type FuelType = z.infer<typeof fuelTypeSchema>;
export const fuelTypeSchema = z.enum(['regular', 'premium', 'diesel', 'e85']);

export type FuelLevel = z.infer<typeof fuelLevelSchema>;
export const fuelLevelSchema = z.enum(['full', 'partial']);
