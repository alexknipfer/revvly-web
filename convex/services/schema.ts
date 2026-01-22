import { defineTable } from 'convex/server';

import { serviceFields } from './validators';

export const servicesTable = defineTable(serviceFields).index(
  'by_userid_vehicleid',
  ['userId', 'vehicleId'],
);
