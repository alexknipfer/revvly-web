import { useState } from 'react';

export function useGeoLocation() {
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
      },
      (error) => {
        setState((state) => ({
          ...state,
          error: new Error(error.message),
          loading: false,
        }));
      },
    );
  };

  return { requestLocation, ...state };
}
