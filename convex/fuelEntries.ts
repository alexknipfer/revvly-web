import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { requireAuth, verifyVerhicleOwnership } from './utils/auth';

export const create = mutation({
  args: {
    date: v.string(),
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
    notes: v.optional(v.string()),
    vehicleId: v.id('vehicles'),
  },
  handler: async (
    ctx,
    {
      date,
      odometer,
      costPerGallon,
      totalGallons,
      type,
      level,
      location,
      notes,
      vehicleId,
    },
  ) => {
    const identity = await requireAuth(ctx);
    await verifyVerhicleOwnership({ ctx, vehicleId, identity });

    const latestFuelEntry = await ctx.db
      .query('fuel_entries')
      .withIndex('by_userid_vehicleid', (q) =>
        q.eq('userId', identity.subject).eq('vehicleId', vehicleId),
      )
      .order('desc')
      .first();

    let mpg: number | undefined = undefined;
    let totalMiles = 0;

    if (latestFuelEntry) {
      mpg = (odometer - latestFuelEntry.odometer) / totalGallons;
      totalMiles = odometer - latestFuelEntry.odometer;
    }

    const totalCost = costPerGallon * totalGallons;

    return await ctx.db.insert('fuel_entries', {
      date,
      odometer,
      costPerGallon,
      totalGallons,
      totalMiles,
      totalCost,
      mpg,
      type,
      level,
      location,
      vehicleId,
      notes,
      userId: identity.subject,
    });
  },
});

export const getAll = query({
  args: {
    vehicleId: v.id('vehicles'),
  },
  handler: async (ctx, { vehicleId }) => {
    const identity = await requireAuth(ctx);
    await verifyVerhicleOwnership({ ctx, vehicleId, identity });

    return await ctx.db
      .query('fuel_entries')
      .withIndex('by_userid_vehicleid', (q) =>
        q.eq('userId', identity.subject).eq('vehicleId', vehicleId),
      )
      .order('desc')
      .collect();
  },
});
