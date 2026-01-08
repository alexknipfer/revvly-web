import { createContext, useContext } from 'react';
import { VehicleWithImage } from '@/modules/core/types/vehicles';

interface VehicleImageContextValue {
  vehicle: VehicleWithImage;
}

export const VehicleImageContext =
  createContext<VehicleImageContextValue | null>(null);

export function useVehicleImageContext() {
  const context = useContext(VehicleImageContext);

  if (!context) {
    throw new Error(
      'VehicleImage sub-components must be used within VehicleImage',
    );
  }

  return context;
}
