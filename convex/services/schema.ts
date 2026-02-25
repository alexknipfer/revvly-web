import { defineTable } from 'convex/server';

import { serviceFields } from './validators';

export const servicesTable = defineTable(serviceFields)
  .index('by_userid_vehicleid', ['userId', 'vehicleId'])
  .index('by_userid', ['userId'])
  .index('by_vehicleid', ['vehicleId']);
