import { v } from 'convex/values';

export const vehicleFields = v.object({
  name: v.optional(v.string()),
  make: v.string(),
  model: v.string(),
  year: v.string(),
  plate: v.string(),
  imageStorageId: v.optional(v.id('_storage')),
  userId: v.string(),
});
