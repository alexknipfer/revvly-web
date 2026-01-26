import { z } from 'zod';

import { zMutation } from './utils/zod';
import { requireAuth, verifyVerhicleOwnership } from './utils/auth';
import {
  fuellyFuelEntryImportSchema,
  fuellyServiceImportSchema,
} from '../src/types/fuel-entry';

export const importFuelEntries = zMutation({
  args: {
    entries: z.array(fuellyFuelEntryImportSchema),
  },
  handler: async (ctx, { entries }) => {
    const identity = await requireAuth(ctx);

    if (entries.length === 0) {
      return 0;
    }

    const vehicleIds = new Set(entries.map((e) => e.vehicleId));
    for (const vehicleId of vehicleIds) {
      await verifyVerhicleOwnership({
        ctx,
        vehicleId,
        identity,
      });
    }

    for (const vehicleId of vehicleIds) {
      const existingEntries = await ctx.db
        .query('fuel_entries')
        .withIndex('by_userid_vehicleid', (q) =>
          q.eq('userId', identity.subject).eq('vehicleId', vehicleId),
        )
        .collect();

      for (const entry of existingEntries) {
        await ctx.db.delete('fuel_entries', entry._id);
      }
    }

    let importedCount = 0;
    for (const entry of entries) {
      try {
        await ctx.db.insert('fuel_entries', {
          date: entry.date,
          odometer: entry.odometer,
          costPerGallon: entry.costPerGallon,
          totalGallons: entry.totalGallons,
          totalCost: entry.totalCost,
          totalMiles: entry.totalMiles,
          mpg: entry.mpg,
          type: entry.type,
          level: entry.level,
          location: entry.location,
          notes: entry.notes,
          vehicleId: entry.vehicleId as any,
          userId: identity.subject,
          missedFuelup: entry.missedFuelup,
        });

        importedCount++;
      } catch (error) {
        // Log error but continue with other entries
        console.error(`Failed to import fuel entry:`, error);
      }
    }

    return importedCount;
  },
});

export const importServices = zMutation({
  args: {
    services: z.array(fuellyServiceImportSchema),
  },
  handler: async (ctx, { services }) => {
    const identity = await requireAuth(ctx);

    if (services.length === 0) {
      return 0;
    }

    const vehicleIds = new Set(services.map((s) => s.vehicleId));
    for (const vehicleId of vehicleIds) {
      await verifyVerhicleOwnership({
        ctx,
        vehicleId,
        identity,
      });
    }

    for (const vehicleId of vehicleIds) {
      const existingServices = await ctx.db
        .query('services')
        .withIndex('by_userid_vehicleid', (q) =>
          q.eq('userId', identity.subject).eq('vehicleId', vehicleId as any),
        )
        .collect();

      for (const service of existingServices) {
        await ctx.db.delete('services', service._id);
      }
    }

    let importedCount = 0;
    for (const service of services) {
      try {
        await ctx.db.insert('services', {
          date: service.date,
          odometer: service.odometer,
          cost: service.cost,
          location: service.location,
          types: service.types,
          notes: service.notes,
          vehicleId: service.vehicleId as any,
          userId: identity.subject,
        });

        importedCount++;
      } catch (error) {
        // Log error but continue with other services
        console.error(`Failed to import service:`, error);
      }
    }

    return importedCount;
  },
});
