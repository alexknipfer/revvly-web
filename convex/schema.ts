import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  vehicles: defineTable({
    id: v.id('vehicles'),
    name: v.optional(v.string()),
    make: v.string(),
    model: v.string(),
    year: v.string(),
    plate: v.string(),
    imageUrl: v.optional(v.string()),
  }),
});
