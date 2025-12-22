import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { requireAuth } from './utils/auth';

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
      totalMilesTracked: 0,
      totalGallonsUsed: 0,
      averageMpg: 0,
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
      vehicles.map(async (vehicle) => ({
        ...vehicle,
        imageUrl: vehicle.imageStorageId
          ? await ctx.storage.getUrl(vehicle.imageStorageId)
          : null,
      })),
    );
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

    const imageUrl = vehicle.imageStorageId
      ? await ctx.storage.getUrl(vehicle.imageStorageId)
      : null;

    return {
      ...vehicle,
      imageUrl,
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
