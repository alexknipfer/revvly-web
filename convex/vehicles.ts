import { v } from 'convex/values';
import { query } from './_generated/server';

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
