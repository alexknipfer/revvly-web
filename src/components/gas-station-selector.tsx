import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import mapboxgl from 'mapbox-gl';

import { appConfig } from '@/lib/appConfig';
import { searchNearbyGasStations } from '@/lib/services/location';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Props {
  value?: string;
  onChange: (location: string) => void;
}

function formatGasStationValue(
  value: Awaited<ReturnType<typeof searchNearbyGasStations>>[number],
) {
  return value.name + ' - ' + value.address;
}

export function GasStationSelector({ value, onChange }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );

  const {
    data: stations = [],
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ['gasStations', userLocation],
    queryFn: () =>
      userLocation
        ? searchNearbyGasStations({ coordinates: userLocation })
        : [],
    enabled: !!userLocation,
  });

  useEffect(() => {
    if (!mapContainer.current) {
      return;
    }

    mapboxgl.accessToken = appConfig.mapbox.accessToken;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-98.5795, 39.8283],
      zoom: 10,
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [
            position.coords.longitude,
            position.coords.latitude,
          ];
          setUserLocation(coords);

          if (map.current) {
            map.current.setCenter(coords);
            map.current.setZoom(13);
          }
        },
        (err) => {
          console.error('Geolocation error:', err);
        },
      );
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || stations.length === 0) {
      return;
    }

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    stations.forEach((station) => {
      if (station.coordinates[0] === 0 && station.coordinates[1] === 0) {
        return;
      }

      const marker = new mapboxgl.Marker({ color: '#3b82f6' })
        .setLngLat(station.coordinates)
        .addTo(map.current!);

      marker.getElement().addEventListener('click', () => {
        onChange(formatGasStationValue(station));
      });

      markersRef.current.push(marker);
    });
  }, [stations, onChange]);

  return (
    <div className="space-y-2">
      <div
        ref={mapContainer}
        className="w-full h-64 rounded-md border border-input overflow-hidden"
      />
      {isLoading && (
        <p className="text-sm text-muted-foreground">
          Loading nearby gas stations...
        </p>
      )}
      {stations.length > 0 && (
        <>
          <p className="text-sm font-medium">Nearby Gas Stations:</p>
          <ScrollArea className="h-48">
            <div className="space-y-1">
              {stations.map((station, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => onChange(formatGasStationValue(station))}
                  className={`w-full text-left p-2 rounded-md text-sm border transition-colors ${
                    value === formatGasStationValue(station)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background hover:bg-accent border-input'
                  }`}
                >
                  <div className="font-medium">{station.name}</div>
                  {station.address && (
                    <div className="text-xs opacity-80">{station.address}</div>
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </>
      )}
      {value && (
        <div className="text-sm text-muted-foreground">Selected: {value}</div>
      )}
    </div>
  );
}
