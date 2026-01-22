import { Car } from 'lucide-react';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { VehicleWithImage } from '@/types/vehicles';

import { VehicleImageUpload } from './vehicle-image-upload';
import { VehicleImageContext } from '@/modules/vehicle/components/vehicle-image/context';

interface VehicleImageProps {
  vehicle: VehicleWithImage;
  children?: React.ReactNode;
}

export function VehicleImage({ vehicle, children }: VehicleImageProps) {
  if (!children) {
    return vehicle.imageUrl ? (
      <AspectRatio ratio={16 / 9}>
        <img
          src={vehicle.imageUrl}
          alt={vehicle.model}
          className="w-full h-full object-cover"
        />
      </AspectRatio>
    ) : (
      <AspectRatio
        ratio={16 / 9}
        className="bg-slate-800 rounded-md flex items-center justify-center relative overflow-hidden"
      >
        <Car className="size-7" />
      </AspectRatio>
    );
  }

  return (
    <VehicleImageContext.Provider value={{ vehicle }}>
      <AspectRatio ratio={16 / 9} className="relative">
        {children}
      </AspectRatio>
    </VehicleImageContext.Provider>
  );
}

VehicleImage.Upload = VehicleImageUpload;
