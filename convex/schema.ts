import { defineSchema } from 'convex/server';

import { fuelEntriesTable } from './fuelEntries/schema';
import { servicesTable } from './services/schema';
import { vehiclesTable } from './vehicles/schema';
import { usersTable } from './users/schema';
import { vehicleSharesTable } from './vehicleShares/schema';

export default defineSchema({
  vehicles: vehiclesTable,
  fuel_entries: fuelEntriesTable,
  services: servicesTable,
  users: usersTable,
  vehicle_shares: vehicleSharesTable,
});
