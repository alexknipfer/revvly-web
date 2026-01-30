import { v } from 'convex/values';

export const userFields = v.object({
  firstName: v.nullable(v.string()),
  lastName: v.nullable(v.string()),
  imageUrl: v.optional(v.string()),
  primaryEmailAddress: v.string(),
  externalId: v.string(),
});
