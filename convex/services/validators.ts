import { v } from 'convex/values';

export const serviceFields = v.object({
  date: v.string(),
  odometer: v.number(),
  cost: v.number(),
  location: v.optional(v.string()),
  type: v.string(),
  notes: v.optional(v.string()),
  vehicleId: v.id('vehicles'),
  userId: v.string(),
});
