import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

import { appConfig } from '@/lib/appConfig';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type GooglePlace } from '@/types/google';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { searchNearbyGasStations } from '@/lib/google';

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
  onSelect: (value: string) => void;
}

function formatGasStationValue(value: GooglePlace) {
  return value.displayName.text + ' - ' + value.formattedAddress;
}

export function NearbyGasStationDialog({
  open,
  onOpenChange,
  geolocation,
  onSelect,
}: Props) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const { coords } = geolocation;
  const initialCenter: google.maps.LatLngLiteral = {
    lat: coords.latitude,
    lng: coords.longitude,
  };
  const [selectedStation, setSelectedStation] = useState('');
  const [mapCenter, setMapCenter] =
    useState<google.maps.LatLngLiteral>(initialCenter);
  const [mapZoom, setMapZoom] = useState(10);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: appConfig.googleMaps.apiKey,
  });

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
        latitude: coords.latitude,
        longitude: coords.longitude,
      }),
    enabled: false,
  });

  const onMapLoad = useCallback(
    async (map: google.maps.Map) => {
      mapRef.current = map;
      const result = await refetchStations();
      if (result.data?.length) {
        setSelectedStation(formatGasStationValue(result.data[0]));
      }
    },
    [refetchStations],
  );

  const centerMapOnStation = useCallback((station: GooglePlace) => {
    const newCenter: google.maps.LatLngLiteral = {
      lat: station.location.latitude,
      lng: station.location.longitude,
    };

    setMapCenter(newCenter);
    setMapZoom(15);
  }, []);

  const onMapUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  const handleMarkerClick = useCallback(
    (station: GooglePlace) => {
      setSelectedStation(formatGasStationValue(station));
      centerMapOnStation(station);
    },
    [centerMapOnStation],
  );

  useEffect(() => {
    if (!stations.length || !mapRef.current) {
      return;
    }

    const firstStation = stations[0];
    const newCenter: google.maps.LatLngLiteral = {
      lat: firstStation.location.latitude,
      lng: firstStation.location.longitude,
    };

    requestAnimationFrame(() => {
      setMapCenter(newCenter);
      setMapZoom(15);
      if (mapRef.current) {
        mapRef.current.panTo(newCenter);
        mapRef.current.setZoom(15);
      }
    });
  }, [stations]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
            <div className="relative w-full h-52 rounded-md border border-input overflow-hidden">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={mapZoom}
                onLoad={onMapLoad}
                onUnmount={onMapUnmount}
                options={{
                  styles: darkMapStyles,
                  disableDefaultUI: false,
                  zoomControl: false,
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
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
            <ScrollArea className="flex-1 min-h-0 max-h-52">
              <div className="space-y-1 pr-4">
                {stations.map((station, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setSelectedStation(formatGasStationValue(station));
                      centerMapOnStation(station);
                    }}
                    className={`w-full text-left p-2 rounded-md text-sm border transition-colors ${
                      selectedStation === formatGasStationValue(station)
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
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            type="button"
            disabled={!selectedStation}
            onClick={() => onSelect(selectedStation)}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
