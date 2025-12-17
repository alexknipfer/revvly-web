import { v } from 'convex/values';

import { mutation } from './_generated/server';
import { requireAuth } from './auth';

export const create = mutation({
  args: {
    odometer: v.number(),
    costPerGallon: v.number(),
    totalGallons: v.number(),
    type: v.union(
      v.literal('regular'),
      v.literal('premium'),
      v.literal('diesel'),
      v.literal('e85'),
    ),
    level: v.union(v.literal('full'), v.literal('partial')),
    location: v.optional(v.string()),
    vehicleId: v.id('vehicles'),
  },
  handler: async (
    ctx,
    { odometer, costPerGallon, totalGallons, type, level, location, vehicleId },
  ) => {
    const identity = await requireAuth(ctx);

    const vehicle = await ctx.db.get(vehicleId);

    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    if (vehicle.userId !== identity.subject) {
      throw new Error('You can only add fuel entries to your own vehicles.');
    }

    const totalCost = costPerGallon * totalGallons;

    const inserted = ctx.db.insert('fuelEntries', {
      odometer,
      costPerGallon,
      totalGallons,
      totalCost,
      type,
      level,
      location,
      vehicleId,
      userId: identity.subject,
    });

    return inserted;
  },
});
