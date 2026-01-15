import z from 'zod';
import { createServerFn } from '@tanstack/react-start';

import { vpicApiClient } from '@/modules/core/lib/apis';
import { tryCatch } from '@/modules/core/lib/utils';
import {
  VehicleMakesResponse,
  VehicleModelsResponse,
} from '@/modules/core/types/vpic';
import { captureException } from '@/modules/core/lib/logger';

export const getVehicleMakesServerFn = createServerFn().handler(async () => {
  const [error, response] = await tryCatch(
    vpicApiClient
      .get<VehicleMakesResponse>('vehicles/GetMakesForVehicleType/car')
      .json(),
  );

  if (error) {
    captureException(error);
    throw new Error('Failed to get vehicle makes');
  }

  return response.Results.map(({ MakeId, MakeName }) => ({
    id: MakeId.toString(),
    name: titleCaseMake(MakeName),
  })).sort((a, b) => a.name.localeCompare(b.name));
});

const GetVehicleModelsForMakeSchema = z.object({
  make: z.string().min(1),
  year: z.string().min(1).max(4),
});

export const getVehicleModelsForMakeServerFn = createServerFn()
  .inputValidator(GetVehicleModelsForMakeSchema)
  .handler(async ({ data }) => {
    const [error, response] = await tryCatch(
      vpicApiClient
        .get<VehicleModelsResponse>(
          `vehicles/GetModelsForMakeYear/make/${data.make}/modelyear/${data.year}`,
        )
        .json(),
    );

    if (error) {
      captureException(error);
      throw new Error('Failed to get vehicle models');
    }

    return Array.from(
      new Map(
        response.Results.map((model) => [
          model.Model_Name,
          {
            id: model.Model_ID.toString(),
            name: model.Model_Name,
          },
        ]),
      ).values(),
    ).sort((a, b) => a.name.localeCompare(b.name));
  });

function titleCaseMake(makeName: string) {
  return makeName
    .toLowerCase()
    .split(' ')
    .map((word) =>
      word
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('-'),
    )
    .join(' ');
}
