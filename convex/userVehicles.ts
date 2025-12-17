import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const create = mutation({
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
      userId: identity.subject,
    });

    return inserted;
  },
});

export const getAll = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new Error(
        'Unauthorized: User identity is required to access this data.',
      );
    }

    const vehicles = await ctx.db
      .query('vehicles')
      .withIndex('by_userid', (q) => q.eq('userId', identity.subject))
      .collect();

    return vehicles;
  },
});
