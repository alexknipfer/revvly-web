import { useCallback, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

import { appConfig } from '@/lib/appConfig';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useServerFn } from '@tanstack/react-start';
import { searchNearbyGasStationsServerFn } from '@/modules/fuel-entry/server/server-fns';
import { type GooglePlace } from '@/types/google';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const darkMapStyles = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b9a76' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3d19c' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#17263c' }],
  },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  geolocation: GeolocationPosition;
  value?: string;
  onChange: (location: string) => void;
}

function formatGasStationValue(value: GooglePlace) {
  return value.displayName.text + ' - ' + value.formattedAddress;
}

export function NearbyGasStationDialog({
  open,
  onOpenChange,
  value,
  geolocation,
  onChange,
}: Props) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const { coords } = geolocation;
  const initialCenter: google.maps.LatLngLiteral = {
    lat: coords.latitude,
    lng: coords.longitude,
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: appConfig.googleMaps.apiKey,
    libraries: ['places'],
  });

  const searchNearbyGasStations = useServerFn(searchNearbyGasStationsServerFn);

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
        data: {
          latitude: coords.latitude,
          longitude: coords.longitude,
        },
      }),
    enabled: false,
  });

  // Compute center and zoom from stations if available, otherwise use initial values
  const mapCenter =
    stations.length > 0
      ? {
          lat: stations[0].location.latitude,
          lng: stations[0].location.longitude,
        }
      : initialCenter;
  const mapZoom = stations.length > 0 ? 15 : 10;

  const onMapLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;
      refetchStations();
    },
    [refetchStations],
  );

  const onMapUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  const handleMarkerClick = useCallback(
    (station: Awaited<ReturnType<typeof searchNearbyGasStations>>[number]) => {
      onChange(formatGasStationValue(station));
    },
    [onChange],
  );

  // Update map when stations change and map is loaded
  useEffect(() => {
    if (!stations.length || !mapRef.current) {
      return;
    }

    const firstStation = stations[0];
    onChange(formatGasStationValue(firstStation));

    const newCenter: google.maps.LatLngLiteral = {
      lat: firstStation.location.latitude,
      lng: firstStation.location.longitude,
    };

    // Update map center and zoom directly via ref
    mapRef.current.setCenter(newCenter);
    mapRef.current.setZoom(15);
  }, [stations, onChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Gas Station</DialogTitle>
          <DialogDescription>
            Choose a gas station from the map or list below
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden flex flex-col space-y-4">
          {!isLoaded ? (
            <div className="relative w-full h-64 rounded-md border border-input overflow-hidden flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Loading map...</p>
            </div>
          ) : (
            <div className="relative w-full h-96 rounded-md border border-input overflow-hidden">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={mapZoom}
                onLoad={onMapLoad}
                onUnmount={onMapUnmount}
                options={{
                  styles: darkMapStyles,
                  disableDefaultUI: false,
                  zoomControl: true,
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: true,
                }}
              >
                {stations.map((station, index) => {
                  if (
                    station.location.latitude === 0 &&
                    station.location.longitude === 0
                  ) {
                    return null;
                  }

                  return (
                    <Marker
                      key={index}
                      position={{
                        lat: station.location.latitude,
                        lng: station.location.longitude,
                      }}
                      onClick={() => handleMarkerClick(station)}
                      icon={{
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: '#3b82f6',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 2,
                      }}
                    />
                  );
                })}
              </GoogleMap>
              {isFetched && !isFetching && stations.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10 pointer-events-none">
                  <p className="text-sm text-muted-foreground">
                    No nearby gas stations found
                  </p>
                </div>
              )}
            </div>
          )}
          {isLoading && (
            <p className="text-sm text-muted-foreground">
              Loading nearby gas stations...
            </p>
          )}
          {stations.length > 0 && (
            <>
              <p className="text-sm font-medium">Nearby Gas Stations:</p>
              <ScrollArea className="flex-1 min-h-0 max-h-16">
                <div className="space-y-1 pr-4">
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
                      <div className="font-medium">
                        {station.displayName.text}
                      </div>
                      <div className="text-xs opacity-80">
                        {station.formattedAddress}
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
