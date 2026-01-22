import { defineSchema } from 'convex/server';

import { fuelEntriesTable } from './fuelEntries/schema';
import { servicesTable } from './services/schema';
import { vehiclesTable } from './vehicles/schema';

export default defineSchema({
  vehicles: vehiclesTable,
  fuel_entries: fuelEntriesTable,
  services: servicesTable,
});
