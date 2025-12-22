import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  vehicles: defineTable({
    name: v.optional(v.string()),
    make: v.string(),
    model: v.string(),
    year: v.string(),
    plate: v.string(),
    // Removed: totalMilesTracked, totalGallonsUsed, averageMpg
    imageStorageId: v.optional(v.id('_storage')),
    userId: v.string(),
  }).index('by_userid', ['userId']),
  fuel_entries: defineTable({
    date: v.string(),
    odometer: v.number(),
    costPerGallon: v.number(),
    totalGallons: v.number(),
    totalCost: v.number(),
    totalMiles: v.number(),
    mpg: v.optional(v.number()),
    type: v.string(),
    level: v.union(v.literal('full'), v.literal('partial')),
    location: v.optional(v.string()),
    vehicleId: v.id('vehicles'),
    userId: v.string(),
  }).index('by_userid_vehicleid', ['userId', 'vehicleId']),
  vehicle_models: defineTable({
    body_styles: v.array(v.string()),
    make: v.string(),
    model: v.string(),
    year: v.float64(),
  })
    .index('by_year', ['year'])
    .index('by_year_make', ['year', 'make']),
});
