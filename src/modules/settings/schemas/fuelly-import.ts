import { z } from 'zod';

export const fuellyImportVehicleMappingSchema = z.object({
  fuellyVehicleName: z.string(),
  vehicleId: z.string().nullable(),
});
export type FuellyImportVehicleMapping = z.infer<
  typeof fuellyImportVehicleMappingSchema
>;
