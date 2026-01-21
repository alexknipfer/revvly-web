import { z } from 'zod';
import { zid } from 'convex-helpers/server/zod4';
import { ConvexError } from 'convex/values';

import { zMutation, zQuery } from './utils/zod';
import { requireAuth, verifyVerhicleOwnership } from './utils/auth';

const serviceFields = z.object({
  date: z.iso.datetime(),
  odometer: z.number(),
  cost: z.number(),
  location: z.string().optional(),
  types: z.array(z.string().min(1)),
  notes: z.string().optional(),
  vehicleId: zid('vehicles'),
});

export const create = zMutation({
  args: serviceFields,
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);
    await verifyVerhicleOwnership({ ctx, vehicleId: args.vehicleId, identity });

    return ctx.db.insert('services', {
      ...args,
      userId: identity.subject,
    });
  },
});

const updateServiceFields = serviceFields.extend({
  id: zid('services'),
});

export const update = zMutation({
  args: updateServiceFields,
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);
    await verifyVerhicleOwnership({ ctx, vehicleId: args.vehicleId, identity });

    const foundService = await ctx.db.get(args.id);

    if (!foundService) {
      throw new ConvexError({ message: 'Service not found' });
    }

    if (foundService.userId !== identity.subject) {
      throw new ConvexError({ message: 'Unauthorized' });
    }

    if (foundService.vehicleId !== args.vehicleId) {
      throw new ConvexError({
        message: 'Service does not belong to this vehicle',
      });
    }

    await ctx.db.patch(args.id, args);

    return args.id;
  },
});

export const getById = zQuery({
  args: {
    id: zid('services'),
  },
  handler: async (ctx, { id }) => {
    const identity = await requireAuth(ctx);
    const service = await ctx.db.get(id);

    if (!service) {
      throw new ConvexError({ message: 'Service not found' });
    }

    if (service.userId !== identity.subject) {
      throw new ConvexError({ message: 'Unauthorized' });
    }

    return service;
  },
});

export const getAll = zQuery({
  args: {
    vehicleId: zid('vehicles'),
  },
  handler: async (ctx, { vehicleId }) => {
    const identity = await requireAuth(ctx);
    await verifyVerhicleOwnership({ ctx, vehicleId, identity });

    return ctx.db
      .query('services')
      .withIndex('by_userid_vehicleid', (q) =>
        q.eq('userId', identity.subject).eq('vehicleId', vehicleId),
      )
      .collect();
  },
});
