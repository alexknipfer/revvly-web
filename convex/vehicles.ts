import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

export const getMakesByYear = query({
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

export const getModelsByYearAndMake = query({
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
