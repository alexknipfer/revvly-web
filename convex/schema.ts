import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  vehicles: defineTable({
    name: v.optional(v.string()),
    make: v.string(),
    model: v.string(),
    year: v.string(),
    plate: v.string(),
    imageUrl: v.optional(v.string()),
    userId: v.string(),
  }).index('by_userid', ['userId']),
  vehicle_models: defineTable({
    body_styles: v.array(v.string()),
    make: v.string(),
    model: v.string(),
    year: v.float64(),
  })
    .index('by_year', ['year'])
    .index('by_year_make', ['year', 'make']),
});
