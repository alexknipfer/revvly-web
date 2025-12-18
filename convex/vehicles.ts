import { v } from 'convex/values';
import { query } from './_generated/server';
import { requireAuth } from './utils/auth';

export const getMakesByYear = query({
  args: {
    year: v.float64(),
  },
  handler: async (ctx, { year }) => {
    await requireAuth(ctx);

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
    await requireAuth(ctx);

    const vehicles = await ctx.db
      .query('vehicle_models')
      .withIndex('by_year_make', (q) => q.eq('year', year).eq('make', make))
      .collect();

    return vehicles.map((vehicle) => vehicle.model);
  },
});
