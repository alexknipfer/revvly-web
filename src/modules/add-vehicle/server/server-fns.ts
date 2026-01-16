import z from 'zod';
import { createServerFn } from '@tanstack/react-start';

import { getVehicleMakes, getVehicleModelsForMake } from '@/api/vpic';
import { tryCatch } from '@/lib/utils';
import { captureException } from '@/lib/logger';

export const getVehicleMakesServerFn = createServerFn().handler(async () => {
  const [error, makes] = await tryCatch(getVehicleMakes());

  if (error) {
    captureException(error);
    throw new Error('Failed to get vehicle makes');
  }

  return makes.Results.map(({ MakeId, MakeName }) => ({
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
    const [error, models] = await tryCatch(
      getVehicleModelsForMake({ make: data.make, year: data.year }),
    );

    if (error) {
      captureException(error);
      throw new Error('Failed to get vehicle models');
    }

    return Array.from(
      new Map(
        models.Results.map((model) => [
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
