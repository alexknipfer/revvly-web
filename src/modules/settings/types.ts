export interface FuellyVehiclePreview {
  name: string;
  fuelEntryCount: number;
  serviceCount: number;
}

export interface FuellyCsvPreview {
  vehicles: Array<FuellyVehiclePreview>;
  totalFuelEntries: number;
  totalServices: number;
}

export interface VehicleMapping {
  fuellyVehicleName: string;
  vehicleId: string | null; // null means skip this vehicle
}

export interface ImportSummary {
  fuelEntriesImported: number;
  servicesImported: number;
  errors: Array<string>;
}
