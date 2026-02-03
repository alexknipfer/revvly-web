import { defineTable } from 'convex/server';

import { vehicleShareFields } from './validators';

export const vehicleSharesTable = defineTable(vehicleShareFields)
  .index('by_userid_acceptedat', ['userId', 'acceptedAt'])
  .index('by_vehicleid_userid', ['vehicleId', 'userId']);
