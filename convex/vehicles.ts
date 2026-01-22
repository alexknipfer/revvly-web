import { z } from 'zod';
import { ConvexError } from 'convex/values';
import { zid } from 'convex-helpers/server/zod4';

import { QueryCtx } from './_generated/server';
import { requireAuth, verifyVerhicleOwnership } from './utils/auth';
import { Id } from './_generated/dataModel';
import { zMutation, zQuery } from './utils/zod';

async function calculateVehicleTotals(
  ctx: QueryCtx,
  vehicleId: Id<'vehicles'>,
  userId: string,
) {
  const entries = await ctx.db
    .query('fuel_entries')
    .withIndex('by_userid_vehicleid', (q) =>
      q.eq('userId', userId).eq('vehicleId', vehicleId),
    )
    .order('asc')
    .collect();

  const sortedEntries = [...entries].sort((a, b) => a.odometer - b.odometer);

  let totalGallonsUsed = 0;
  let totalMilesTracked = 0;
  let gallonsForMpgCalculation = 0;

  for (let i = 0; i < sortedEntries.length; i++) {
    const entry = sortedEntries[i];
    totalGallonsUsed += entry.totalGallons;

    // MPG calculation: only entries after the first one contribute to miles tracked
    if (i > 0) {
      const previousEntry = sortedEntries[i - 1];
      const miles = entry.odometer - previousEntry.odometer;

      if (miles > 0 && entry.mpg) {
        totalMilesTracked += miles;
        // Only count gallons from entries that have MPG (i.e., not the first entry)
        gallonsForMpgCalculation += entry.totalGallons;
      }
    }
  }

  const averageMpg =
    gallonsForMpgCalculation > 0
      ? totalMilesTracked / gallonsForMpgCalculation
      : 0;

  return {
    totalGallonsUsed,
    totalMilesTracked,
    averageMpg,
    latestOdometer:
      sortedEntries.length > 0
        ? sortedEntries[sortedEntries.length - 1].odometer
        : null,
  };
}

export const create = zMutation({
  args: {
    name: z.string().optional(),
    make: z.string(),
    model: z.string(),
    year: z.string(),
    plate: z.string(),
  },
  handler: async (ctx, { name, make, model, year, plate }) => {
    const identity = await requireAuth(ctx);

    const inserted = ctx.db.insert('vehicles', {
      name,
      make,
      model,
      year,
      plate,
      userId: identity.subject,
    });

    return inserted;
  },
});

export const getAll = zQuery({
  handler: async (ctx) => {
    const identity = await requireAuth(ctx);

    const vehicles = await ctx.db
      .query('vehicles')
      .withIndex('by_userid', (q) => q.eq('userId', identity.subject))
      .collect();

    return Promise.all(
      vehicles.map(async (vehicle) => {
        return {
          ...vehicle,
          imageUrl: vehicle.imageStorageId
            ? await ctx.storage.getUrl(vehicle.imageStorageId)
            : null,
        };
      }),
    );
  },
});

export const getFirst = zQuery({
  handler: async (ctx) => {
    const identity = await requireAuth(ctx);

    const vehicle = await ctx.db
      .query('vehicles')
      .withIndex('by_userid', (q) => q.eq('userId', identity.subject))
      .first();

    return vehicle;
  },
});

export const getById = zQuery({
  args: {
    id: zid('vehicles'),
  },
  handler: async (ctx, { id }) => {
    const identity = await requireAuth(ctx);

    const vehicle = await ctx.db.get(id);

    if (!vehicle) {
      throw new ConvexError({ message: 'Vehicle not found' });
    }

    if (vehicle.userId !== identity.subject) {
      throw new ConvexError({
        message: 'You can only view your own vehicles.',
      });
    }

    const totals = await calculateVehicleTotals(
      ctx,
      vehicle._id,
      identity.subject,
    );

    const imageUrl = vehicle.imageStorageId
      ? await ctx.storage.getUrl(vehicle.imageStorageId)
      : null;

    return {
      ...vehicle,
      imageUrl,
      ...totals,
    };
  },
});

export const update = zMutation({
  args: {
    id: zid('vehicles'),
    update: z.object({
      name: z.string().optional(),
      plate: z.string().optional(),
      imageStorageId: zid('_storage').optional(),
    }),
  },
  handler: async (ctx, { id, update }) => {
    const identity = await requireAuth(ctx);
    await verifyVerhicleOwnership({ ctx, vehicleId: id, identity });

    await ctx.db.patch(id, update);

    return id;
  },
});

export const deleteById = zMutation({
  args: {
    id: zid('vehicles'),
  },
  handler: async (ctx, { id }) => {
    const identity = await requireAuth(ctx);
    await verifyVerhicleOwnership({ ctx, vehicleId: id, identity });
    await ctx.db.delete('vehicles', id);

    const fuelEntries = await ctx.db
      .query('fuel_entries')
      .withIndex('by_userid_vehicleid', (q) =>
        q.eq('userId', identity.subject).eq('vehicleId', id),
      )
      .collect();

    for (const fuelEntry of fuelEntries) {
      await ctx.db.delete('fuel_entries', fuelEntry._id);
    }

    return id;
  },
});
