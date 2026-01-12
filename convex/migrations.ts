import { Migrations } from '@convex-dev/migrations';
import { components } from './_generated/api.js';
import { DataModel } from './_generated/dataModel.js';

export const migrations = new Migrations<DataModel>(components.migrations);
export const run = migrations.runner();

export const setMissedFuelupDefault = migrations.define({
  table: 'fuel_entries',
  migrateOne: async (ctx, doc) => {
    if (doc.missedFuelup === undefined) {
      await ctx.db.patch(doc._id, {
        missedFuelup: false,
      });
    }
  },
});
