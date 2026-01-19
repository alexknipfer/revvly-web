import z from 'zod';

export type FuelType = z.infer<typeof fuelTypeSchema>;
export const fuelTypeSchema = z.enum(['regular', 'premium', 'diesel', 'e85']);

export type FuelLevel = z.infer<typeof fuelLevelSchema>;
export const fuelLevelSchema = z.enum(['full', 'partial']);
