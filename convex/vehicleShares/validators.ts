import { v } from 'convex/values';

export const vehicleShareFields = v.object({
  vehicleId: v.id('vehicles'),
  userId: v.id('users'),
  invitedBy: v.string(),
  invitedAt: v.string(),
  acceptedAt: v.optional(v.string()),
  expiresAt: v.optional(v.string()),
});
