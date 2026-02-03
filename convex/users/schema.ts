import { defineTable } from 'convex/server';

import { userFields } from './validators';

export const usersTable = defineTable(userFields)
  .index('by_externalid', ['externalId'])
  .index('by_email', ['primaryEmailAddress']);
