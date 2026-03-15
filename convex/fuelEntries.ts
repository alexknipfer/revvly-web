import { ConvexError } from 'convex/values';
import dayjs from 'dayjs';
import { z } from 'zod';
import { zid } from 'convex-helpers/server/zod4';

import { fuelTypeSchema, fuelLevelSchema } from '../src/types/fuel-entry';

import { requireAuth, verifyVehicleAccess } from './utils/auth';
import { zMutation, zQuery } from './utils/zod';

const fuelEntryFields = z.object({
  date: z.iso.datetime(),
  odometer: z.number(),
  costPerGallon: z.number(),
  totalGallons: z.number(),
  type: fuelTypeSchema,
  level: fuelLevelSchema,
  location: z.string().optional(),
  notes: z.string().optional(),
  vehicleId: zid('vehicles'),
  missedFuelup: z.boolean(),
});

export const create = zMutation({
  args: fuelEntryFields,
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
    await verifyVehicleAccess({ ctx, vehicleId, identity });

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

export const getById = zQuery({
  args: {
    id: zid('fuel_entries'),
  },
  handler: async (ctx, { id }) => {
    const identity = await requireAuth(ctx);
    const entry = await ctx.db.get('fuel_entries', id);

    if (!entry) {
      throw new ConvexError({ message: 'Fuel entry not found' });
    }

    await verifyVehicleAccess({ ctx, vehicleId: entry.vehicleId, identity });

    return entry;
  },
});

const updateFuelEntryFields = fuelEntryFields.extend({
  id: zid('fuel_entries'),
});

export const update = zMutation({
  args: updateFuelEntryFields,
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
      throw new ConvexError({
        message: 'Only the entry creator can update this fuel entry.',
      });
    }

    await verifyVehicleAccess({
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
      date,
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

export const getAll = zQuery({
  args: {
    vehicleId: zid('vehicles'),
    startDate: z.iso.datetime().optional(),
  },
  handler: async (ctx, { vehicleId, startDate }) => {
    const identity = await requireAuth(ctx);
    await verifyVehicleAccess({ ctx, vehicleId, identity });

    const query = ctx.db
      .query('fuel_entries')
      .withIndex('by_vehicleid', (q) => q.eq('vehicleId', vehicleId));

    if (startDate) {
      query.filter((q) => q.gte(q.field('date'), startDate));
    }

    const results = await query.collect();

    return results.sort(
      (a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf(),
    );
  },
});
