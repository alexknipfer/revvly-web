import { v } from 'convex/values';

export const vehicleShareFields = v.object({
  vehicleId: v.id('vehicles'),
  userId: v.string(),
  invitedBy: v.string(),
  status: v.union(
    v.literal('pending'),
    v.literal('accepted'),
    v.literal('rejected'),
  ),
  invitedAt: v.string(),
  acceptedAt: v.optional(v.string()),
  expiresAt: v.optional(v.string()),
});
