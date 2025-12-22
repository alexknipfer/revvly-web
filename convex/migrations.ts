import { Migrations } from '@convex-dev/migrations';
import { components } from './_generated/api.js';
import { DataModel } from './_generated/dataModel.js';

export const migrations = new Migrations<DataModel>(components.migrations);
export const run = migrations.runner();

export const addVehicleTotalMilesTracked = migrations.define({
  table: 'vehicles',
  migrateOne: async (_ctx, doc) => {
    if (!doc.totalMilesTracked) {
      return { totalMilesTracked: 0 };
    }
  },
});

export const addVehicleAverageMpg = migrations.define({
  table: 'vehicles',
  migrateOne: async (_ctx, doc) => {
    if (!doc.averageMpg) {
      return { averageMpg: 0 };
    }
  },
});

export const addVehicleTotalGallonsUsed = migrations.define({
  table: 'vehicles',
  migrateOne: async (_ctx, doc) => {
    if (!doc.totalGallonsUsed) {
      return { totalGallonsUsed: 0 };
    }
  },
});
