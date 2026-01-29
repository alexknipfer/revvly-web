import { v } from 'convex/values';

export const userFields = v.object({
  firstName: v.nullable(v.string()),
  lastName: v.nullable(v.string()),
  externalId: v.string(),
});
