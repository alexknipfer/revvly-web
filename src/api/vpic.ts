import ky from 'ky';

import { VehicleMakesResponse, VehicleModelsResponse } from '@/types/vpic';

const vpicApiClient = ky.create({
  prefixUrl: 'https://vpic.nhtsa.dot.gov/api',
  searchParams: {
    format: 'json',
  },
});

export function getVehicleMakes() {
  return vpicApiClient
    .get<VehicleMakesResponse>('vehicles/GetMakesForVehicleType/car')
    .json();
}

export function getVehicleModelsForMake({
  make,
  year,
}: {
  make: string;
  year: string;
}) {
  return vpicApiClient
    .get<VehicleModelsResponse>(
      `vehicles/GetModelsForMakeYear/make/${make}/modelyear/${year}`,
    )
    .json();
}
