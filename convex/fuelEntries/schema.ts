import { defineTable } from 'convex/server';

import { fuelEntryFields } from './validators';

export const fuelEntriesTable = defineTable(fuelEntryFields)
  .index('by_userid_vehicleid', ['userId', 'vehicleId'])
  .index('by_userid', ['userId'])
  .index('by_vehicleid', ['vehicleId']);
