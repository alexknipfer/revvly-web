import { Doc } from 'convex/_generated/dataModel';

export type VehicleWithImage = Doc<'vehicles'> & {
  imageUrl: string | null;
};

export type VehicleWithStats = Doc<'vehicles'> & {
  totalMilesTracked: number;
  totalGallonsUsed: number;
  averageMpg: number;
};
