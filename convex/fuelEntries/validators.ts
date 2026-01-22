import { v } from 'convex/values';

export const fuelEntryFields = v.object({
  date: v.string(),
  odometer: v.number(),
  costPerGallon: v.number(),
  totalGallons: v.number(),
  totalCost: v.number(),
  totalMiles: v.number(),
  mpg: v.optional(v.number()),
  type: v.string(),
  level: v.string(),
  location: v.optional(v.string()),
  notes: v.optional(v.string()),
  vehicleId: v.id('vehicles'),
  userId: v.string(),
  missedFuelup: v.boolean(),
});
