import { z } from 'zod';
import { ConvexError } from 'convex/values';
import { zid } from 'convex-helpers/server/zod4';

import {
  requireAuth,
  verifyVerhicleOwnership,
  verifyVehicleAccess,
  getSharedVehicleIds,
} from './utils/auth';
import { zMutation, zQuery } from './utils/zod';
import { fuelTypeSchema } from '../src/types/fuel-entry';

export const getVehicleAnalytics = zQuery({
  args: {
    id: zid('vehicles'),
  },
  handler: async (ctx, { id }) => {
    const identity = await requireAuth(ctx);

    await verifyVehicleAccess({ ctx, vehicleId: id, identity });

    const fuelEntries = await ctx.db
      .query('fuel_entries')
      .withIndex('by_vehicleid', (q) => q.eq('vehicleId', id))
      .order('asc')
      .collect();

    const services = await ctx.db
      .query('services')
      .withIndex('by_vehicleid', (q) => q.eq('vehicleId', id))
      .collect();

    const sortedEntries = [...fuelEntries].sort(
      (a, b) => a.odometer - b.odometer,
    );

    let totalGallonsUsed = 0;
    let totalMilesTracked = 0;
    let gallonsForMpgCalculation = 0;
    let totalFuelCost = 0;
    const mpgValues: number[] = [];

    for (let i = 0; i < sortedEntries.length; i++) {
      const entry = sortedEntries[i];
      totalGallonsUsed += entry.totalGallons;
      totalFuelCost += entry.totalCost || 0;

      // MPG calculation: only entries after the first one contribute to miles tracked
      if (i > 0) {
        const previousEntry = sortedEntries[i - 1];
        const miles = entry.odometer - previousEntry.odometer;

        if (miles > 0 && entry.mpg) {
          totalMilesTracked += miles;
          gallonsForMpgCalculation += entry.totalGallons;
          mpgValues.push(entry.mpg);
        }
      }
    }

    const averageMpg =
      gallonsForMpgCalculation > 0
        ? totalMilesTracked / gallonsForMpgCalculation
        : 0;

    const lowestMpg = mpgValues.length > 0 ? Math.min(...mpgValues) : null;
    const bestMpg = mpgValues.length > 0 ? Math.max(...mpgValues) : null;

    const totalServiceCost = services.reduce(
      (sum, service) => sum + service.cost,
      0,
    );

    return {
      totalGallonsUsed,
      totalMilesTracked,
      averageMpg,
      lowestMpg,
      bestMpg,
      totalFuelCost,
      fuelLogCount: fuelEntries.length,
      serviceLogCount: services.length,
      totalServiceCost,
      latestOdometer:
        sortedEntries.length > 0
          ? sortedEntries[sortedEntries.length - 1].odometer
          : null,
    };
  },
});

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

    const ownVehicles = await ctx.db
      .query('vehicles')
      .withIndex('by_userid', (q) => q.eq('userId', identity.subject))
      .collect();

    const sharedVehicleIds = await getSharedVehicleIds(ctx, identity);
    const sharedVehicles = (
      await Promise.all(sharedVehicleIds.map((id) => ctx.db.get(id)))
    ).filter((v): v is NonNullable<typeof v> => v !== null);

    const allVehicles = [...ownVehicles, ...sharedVehicles];

    return Promise.all(
      allVehicles.map(async (vehicle) => {
        return {
          ...vehicle,
          isShared: vehicle.userId !== identity.subject,
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

    const ownVehicle = await ctx.db
      .query('vehicles')
      .withIndex('by_userid', (q) => q.eq('userId', identity.subject))
      .first();

    if (ownVehicle) {
      return ownVehicle;
    }

    const sharedVehicleIds = await getSharedVehicleIds(ctx, identity);
    if (sharedVehicleIds.length > 0) {
      return ctx.db.get(sharedVehicleIds[0]);
    }

    return null;
  },
});

export const getById = zQuery({
  args: {
    id: zid('vehicles'),
  },
  handler: async (ctx, { id }) => {
    const identity = await requireAuth(ctx);

    const { vehicle } = await verifyVehicleAccess({
      ctx,
      vehicleId: id,
      identity,
    });

    const imageUrl = vehicle.imageStorageId
      ? await ctx.storage.getUrl(vehicle.imageStorageId)
      : null;

    return {
      ...vehicle,
      isShared: vehicle.userId !== identity.subject,
      imageUrl,
    };
  },
});

export const update = zMutation({
  args: {
    id: zid('vehicles'),
    update: z.object({
      name: z.string().optional(),
      plate: z.string().optional(),
      defaultFuelType: fuelTypeSchema.optional(),
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
      .withIndex('by_vehicleid', (q) => q.eq('vehicleId', id))
      .collect();

    const services = await ctx.db
      .query('services')
      .withIndex('by_vehicleid', (q) => q.eq('vehicleId', id))
      .collect();

    for (const service of services) {
      await ctx.db.delete('services', service._id);
    }

    for (const fuelEntry of fuelEntries) {
      await ctx.db.delete('fuel_entries', fuelEntry._id);
    }

    return id;
  },
});
