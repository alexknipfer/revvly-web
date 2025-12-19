import { useCallback, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import mapboxgl from 'mapbox-gl';

import { appConfig } from '@/lib/appConfig';
import { searchNearbyGasStations } from '@/lib/services/mapbox';
import { ScrollArea } from '@/components/ui/scroll-area';

import 'mapbox-gl/dist/mapbox-gl.css';

interface Props {
  geolocation: GeolocationPosition;
  value?: string;
  onChange: (location: string) => void;
}

function formatGasStationValue(
  value: Awaited<ReturnType<typeof searchNearbyGasStations>>[number],
) {
  return value.name + ' - ' + value.address;
}

export function GasStationSelector({ value, geolocation, onChange }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const { coords } = geolocation;

  const {
    data: stations = [],
    refetch: refetchStations,
    isLoading,
    isFetching,
    isFetched,
  } = useQuery({
    queryKey: ['gasStations', coords.longitude, coords.latitude],
    queryFn: () =>
      searchNearbyGasStations({
        coordinates: [coords.longitude, coords.latitude],
      }),
    enabled: false,
  });

  const initializeMap = useCallback(() => {
    if (!mapContainer.current) {
      return;
    }

    mapboxgl.accessToken = appConfig.mapbox.accessToken;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [coords.longitude, coords.latitude],
      zoom: 10,
    });

    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserHeading: true,
    });
    map.current?.addControl(geolocateControl);

    if (map.current) {
      map.current.on('load', async () => {
        refetchStations();
      });
    }
  }, [coords.longitude, coords.latitude, refetchStations]);

  const addStationMarkers = useCallback(() => {
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

  useEffect(() => {
    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [initializeMap]);

  useEffect(() => {
    if (!stations.length) {
      return;
    }

    const firstStation = stations[0];
    onChange(formatGasStationValue(firstStation));

    map.current?.setCenter([
      firstStation.coordinates[0],
      firstStation.coordinates[1],
    ]);
    map.current?.setZoom(15);

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    addStationMarkers();

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
    };
  }, [stations, onChange, addStationMarkers]);

  return (
    <div className="space-y-2">
      <div className="relative w-full h-64 rounded-md border border-input overflow-hidden">
        <div ref={mapContainer} className="w-full h-full" />
        {isFetched && !isFetching && stations.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
            <p className="text-sm text-muted-foreground">
              No nearby gas stations found
            </p>
          </div>
        )}
      </div>
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
    </div>
  );
}
