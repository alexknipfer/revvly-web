import { defineTable } from 'convex/server';

import { vehicleFields } from './validators';

export const vehiclesTable = defineTable(vehicleFields).index('by_userid', [
  'userId',
]);
