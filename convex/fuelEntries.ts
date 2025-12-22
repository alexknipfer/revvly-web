import { v } from 'convex/values';

import { mutation } from './_generated/server';
import { requireAuth, verifyVerhicleOwnership } from './utils/auth';

export const create = mutation({
  args: {
    date: v.string(),
    odometer: v.number(),
    costPerGallon: v.number(),
    totalGallons: v.number(),
    type: v.union(
      v.literal('regular'),
      v.literal('premium'),
      v.literal('diesel'),
      v.literal('e85'),
    ),
    level: v.union(v.literal('full'), v.literal('partial')),
    location: v.optional(v.string()),
    vehicleId: v.id('vehicles'),
  },
  handler: async (
    ctx,
    {
      date,
      odometer,
      costPerGallon,
      totalGallons,
      type,
      level,
      location,
      vehicleId,
    },
  ) => {
    const identity = await requireAuth(ctx);
    const vehicle = await verifyVerhicleOwnership({ ctx, vehicleId, identity });

    const latestFuelEntry = await ctx.db
      .query('fuel_entries')
      .withIndex('by_userid_vehicleid', (q) =>
        q.eq('userId', identity.subject).eq('vehicleId', vehicleId),
      )
      .order('desc')
      .first();

    let mpg: number | undefined = undefined;
    let totalMiles = 0;

    if (latestFuelEntry) {
      mpg = (odometer - latestFuelEntry.odometer) / totalGallons;
      totalMiles = odometer - latestFuelEntry.odometer;
    }

    const totalCost = costPerGallon * totalGallons;

    const inserted = await ctx.db.insert('fuel_entries', {
      date,
      odometer,
      costPerGallon,
      totalGallons,
      totalMiles,
      totalCost,
      mpg,
      type,
      level,
      location,
      vehicleId,
      userId: identity.subject,
    });

    const updateData: {
      totalGallonsUsed: number;
      totalMilesTracked?: number;
      averageMpg?: number;
    } = {
      totalGallonsUsed: vehicle.totalGallonsUsed + totalGallons,
    };

    if (mpg && totalMiles > 0 && latestFuelEntry) {
      const newTotalMilesTracked = vehicle.totalMilesTracked + totalMiles;

      // Calculate average MPG using only gallons that contributed to miles tracked
      // The first entry's gallons don't contribute to miles (no previous entry to calculate from)
      // So we need to exclude the first entry's gallons from the calculation
      let gallonsForMpgCalculation: number;

      if (vehicle.totalMilesTracked === 0) {
        // This is the first MPG calculation (second entry)
        // Only count this entry's gallons since previous entry had no MPG
        gallonsForMpgCalculation = totalGallons;
      } else {
        const gallonsFromPreviousMpgEntries =
          vehicle.totalMilesTracked / vehicle.averageMpg;
        gallonsForMpgCalculation = gallonsFromPreviousMpgEntries + totalGallons;
      }

      const newAverageMpg = newTotalMilesTracked / gallonsForMpgCalculation;

      updateData.totalMilesTracked = newTotalMilesTracked;
      updateData.averageMpg = newAverageMpg;
    }

    await ctx.db.patch(vehicle._id, updateData);

    return inserted;
  },
});
