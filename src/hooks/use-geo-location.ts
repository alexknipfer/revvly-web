import { useState } from 'react';

interface UseGeoLocationArgs {
  onSuccess?: (location: GeolocationPosition) => void;
}

export function useGeoLocation({ onSuccess }: UseGeoLocationArgs = {}) {
  const [state, setState] = useState<{
    location: GeolocationPosition | null;
    loading: boolean;
    error: Error | null;
  }>({
    location: null,
    loading: false,
    error: null,
  });

  const requestLocation = () => {
    setState((state) => ({ ...state, loading: true }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState((state) => ({
          ...state,
          location: position,
          loading: false,
          error: null,
        }));
        onSuccess?.(position);
      },
      (error) => {
        setState((state) => ({
          ...state,
          error: new Error(error.message),
          loading: false,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  };

  return { requestLocation, ...state };
}
