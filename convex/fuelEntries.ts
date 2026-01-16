import { ConvexError, v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { requireAuth, verifyVerhicleOwnership } from './utils/auth';
import dayjs from 'dayjs';

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
    missedFuelup: v.boolean(),
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
      missedFuelup,
    },
  ) => {
    const identity = await requireAuth(ctx);
    await verifyVerhicleOwnership({ ctx, vehicleId, identity });

    let mpg: number | undefined = undefined;
    let totalMiles = 0;

    const latestFuelEntry = await ctx.db
      .query('fuel_entries')
      .withIndex('by_userid_vehicleid', (q) =>
        q.eq('userId', identity.subject).eq('vehicleId', vehicleId),
      )
      .filter((q) => q.lt(q.field('date'), date))
      .order('desc')
      .first();

    if (latestFuelEntry && odometer <= latestFuelEntry.odometer) {
      throw new ConvexError({
        message:
          'Your current odometer value is less than your previous fuel entry',
      });
    }

    if (latestFuelEntry && !missedFuelup) {
      mpg = (odometer - latestFuelEntry.odometer) / totalGallons;
      totalMiles = odometer - latestFuelEntry.odometer;
    }

    const totalCost = costPerGallon * totalGallons;

    return ctx.db.insert('fuel_entries', {
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
      missedFuelup,
    });
  },
});

export const getById = query({
  args: {
    id: v.id('fuel_entries'),
  },
  handler: async (ctx, { id }) => {
    const identity = await requireAuth(ctx);
    const entry = await ctx.db.get('fuel_entries', id);

    if (!entry) {
      throw new ConvexError({ message: 'Fuel entry not found' });
    }

    if (entry.userId !== identity.subject) {
      throw new ConvexError({ message: 'Unauthorized' });
    }

    return entry;
  },
});

export const update = mutation({
  args: {
    id: v.id('fuel_entries'),
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
    missedFuelup: v.boolean(),
  },
  handler: async (
    ctx,
    {
      id,
      date,
      odometer,
      costPerGallon,
      totalGallons,
      type,
      level,
      location,
      notes,
      missedFuelup,
    },
  ) => {
    const identity = await requireAuth(ctx);

    const currentEntry = await ctx.db.get(id);

    if (!currentEntry) {
      throw new ConvexError({ message: 'Fuel entry not found' });
    }

    if (currentEntry.userId !== identity.subject) {
      throw new ConvexError({ message: 'Unauthorized' });
    }

    await verifyVerhicleOwnership({
      ctx,
      vehicleId: currentEntry.vehicleId,
      identity,
    });

    const totalCost = costPerGallon * totalGallons;

    const previousEntry = await ctx.db
      .query('fuel_entries')
      .withIndex('by_userid_vehicleid', (q) =>
        q
          .eq('userId', identity.subject)
          .eq('vehicleId', currentEntry.vehicleId),
      )
      .filter((q) =>
        q.and(q.lt(q.field('date'), date), q.neq(q.field('_id'), id)),
      )
      .order('desc')
      .first();

    if (previousEntry && odometer <= previousEntry.odometer) {
      throw new ConvexError({
        message:
          'Your current odometer value is less than your previous fuel entry',
      });
    }

    let mpg: number | undefined = undefined;
    let totalMiles = 0;

    if (!missedFuelup && previousEntry) {
      mpg = (odometer - previousEntry.odometer) / totalGallons;
      totalMiles = odometer - previousEntry.odometer;
    }

    await ctx.db.patch(id, {
      odometer,
      costPerGallon,
      totalGallons,
      totalCost,
      totalMiles,
      mpg,
      type,
      level,
      location,
      notes,
      missedFuelup,
    });

    // Find next fuel entry (after this one) and recalculate its MPG
    const nextEntry = await ctx.db
      .query('fuel_entries')
      .withIndex('by_userid_vehicleid', (q) =>
        q
          .eq('userId', identity.subject)
          .eq('vehicleId', currentEntry.vehicleId),
      )
      .filter((q) =>
        q.and(
          q.gt(q.field('date'), currentEntry.date),
          q.neq(q.field('_id'), id),
        ),
      )
      .order('asc')
      .first();

    if (nextEntry && !nextEntry.missedFuelup) {
      const nextMpg = (nextEntry.odometer - odometer) / nextEntry.totalGallons;
      const nextTotalMiles = nextEntry.odometer - odometer;

      await ctx.db.patch(nextEntry._id, {
        mpg: nextMpg,
        totalMiles: nextTotalMiles,
      });
    }

    return id;
  },
});

export const getAll = query({
  args: {
    vehicleId: v.id('vehicles'),
    startDate: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { vehicleId, startDate = dayjs().subtract(1, 'year').toISOString() },
  ) => {
    const identity = await requireAuth(ctx);
    await verifyVerhicleOwnership({ ctx, vehicleId, identity });

    const results = await ctx.db
      .query('fuel_entries')
      .withIndex('by_userid_vehicleid', (q) =>
        q.eq('userId', identity.subject).eq('vehicleId', vehicleId),
      )
      .filter((q) => q.gte(q.field('date'), startDate))
      .order('desc')
      .collect();

    return results;
  },
});
