import { ConvexError, v } from 'convex/values';
import { mutation, query, QueryCtx } from './_generated/server';
import { requireAuth } from './utils/auth';
import { Id } from './_generated/dataModel';

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
    latestOdometer: sortedEntries[sortedEntries.length - 1].odometer,
  };
}

export const create = mutation({
  args: {
    name: v.optional(v.string()),
    make: v.string(),
    model: v.string(),
    year: v.string(),
    plate: v.string(),
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

export const getAll = query({
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

export const getFirst = query({
  handler: async (ctx) => {
    const identity = await requireAuth(ctx);

    const vehicle = await ctx.db
      .query('vehicles')
      .withIndex('by_userid', (q) => q.eq('userId', identity.subject))
      .first();

    return vehicle;
  },
});

export const getById = query({
  args: {
    id: v.id('vehicles'),
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

export const update = mutation({
  args: {
    id: v.id('vehicles'),
    update: v.object({
      name: v.optional(v.string()),
      make: v.optional(v.string()),
      model: v.optional(v.string()),
      year: v.optional(v.string()),
      plate: v.optional(v.string()),
      imageStorageId: v.optional(v.id('_storage')),
    }),
  },
  handler: async (ctx, { id, update }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new Error(
        'Unauthorized: User identity is required to access this data.',
      );
    }

    const vehicle = await ctx.db.get(id);

    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    if (vehicle.userId !== identity.subject) {
      throw new Error('You can only update your own vehicles.');
    }

    await ctx.db.patch(id, update);

    return id;
  },
});
