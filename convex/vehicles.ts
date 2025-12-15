import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

export const getVehicleMakesByYear = query({
  args: {
    year: v.float64(),
  },
  handler: async (ctx, { year }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new Error(
        'Unauthorized: User identity is required to access this data.',
      );
    }

    const vehicles = await ctx.db
      .query('vehicle_models')
      .withIndex('by_year', (q) => q.eq('year', year))
      .collect();

    return Array.from(
      new Set(
        vehicles
          .sort((a, b) => a.make.localeCompare(b.make))
          .map((vehicle) => vehicle.make),
      ),
    );
  },
});

export const getVehicleModelsByYearAndMake = query({
  args: {
    year: v.float64(),
    make: v.string(),
  },
  handler: async (ctx, { year, make }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new Error(
        'Unauthorized: User identity is required to access this data.',
      );
    }

    const vehicles = await ctx.db
      .query('vehicle_models')
      .withIndex('by_year_make', (q) => q.eq('year', year).eq('make', make))
      .collect();

    return vehicles.map((vehicle) => vehicle.model);
  },
});

export const createUserVehicle = mutation({
  args: {
    name: v.optional(v.string()),
    make: v.string(),
    model: v.string(),
    year: v.string(),
    plate: v.string(),
  },
  handler: async (ctx, { name, make, model, year, plate }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new Error(
        'Unauthorized: User identity is required to access this data.',
      );
    }

    const inserted = ctx.db.insert('vehicles', {
      name,
      make,
      model,
      year,
      plate,
      userId: identity.tokenIdentifier,
    });

    return inserted;
  },
});

export const getUserVehicles = query({
  handler: async (ctx) => {
    console.log('server identity', await ctx.auth.getUserIdentity());
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new Error(
        'Unauthorized: User identity is required to access this data.',
      );
    }

    const vehicles = await ctx.db
      .query('vehicles')
      .withIndex('by_userid', (q) => q.eq('userId', identity.tokenIdentifier))
      .collect();

    return vehicles;
  },
});
