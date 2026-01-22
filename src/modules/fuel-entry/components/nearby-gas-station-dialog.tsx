import { useCallback, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type MapLibreGL from 'maplibre-gl';
import { Fuel } from 'lucide-react';

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
import { Card } from '@/components/ui/card';
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
} from '@/components/ui/map';
import { nearbyGasStationsQueryOptions } from '@/api/query-options';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userLocation: GeolocationPosition;
  onSelect: (value: GooglePlace) => void;
}

export function NearbyGasStationDialog({
  open,
  onOpenChange,
  userLocation,
  onSelect,
}: Props) {
  const mapRef = useRef<MapLibreGL.Map>(null);
  const { coords: userCoords } = userLocation;
  const [selectedStation, setSelectedStation] = useState<GooglePlace | null>(
    null,
  );

  const {
    data: stations = [],
    isLoading,
    isFetching,
    isFetched,
  } = useQuery(
    nearbyGasStationsQueryOptions({
      lat: userCoords.latitude,
      lng: userCoords.longitude,
      enabled: open,
    }),
  );

  const panToGasStation = useCallback((station: GooglePlace) => {
    mapRef.current?.flyTo({
      center: {
        lat: station.location.latitude,
        lon: station.location.longitude,
      },
      zoom: 15,
    });
  }, []);

  const selectedStationValue =
    selectedStation || (stations.length > 0 ? stations[0] : null);

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
          <Card className="relative h-52 p-0 overflow-hidden">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10 pointer-events-none rounded-xl">
                <p className="text-sm text-muted-foreground">
                  Loading nearby gas stations...
                </p>
              </div>
            ) : (
              <Map
                ref={mapRef}
                center={{
                  lat:
                    selectedStationValue?.location.latitude ||
                    userCoords.latitude,
                  lng:
                    selectedStationValue?.location.longitude ||
                    userCoords.longitude,
                }}
                zoom={15}
              >
                <MapMarker
                  longitude={userCoords.longitude}
                  latitude={userCoords.latitude}
                >
                  <MarkerContent>
                    <div className="relative size-5">
                      <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75" />
                      <div className="relative bg-blue-600 rounded-full size-5 border-2 border-white shadow-lg" />
                    </div>
                  </MarkerContent>
                </MapMarker>
                {stations.map((station) => (
                  <MapMarker
                    key={station.id}
                    longitude={station.location.longitude}
                    latitude={station.location.latitude}
                  >
                    <MarkerContent>
                      <div className="flex items-center justify-center size-6 rounded-full bg-green-700 border border-white shadow-lg">
                        <Fuel className="size-3" />
                      </div>
                    </MarkerContent>
                    <MarkerPopup className="space-y-2">
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">
                          {station.displayName.text}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {station.formattedAddress}
                        </p>
                      </div>
                      {selectedStation?.id !== station.id && (
                        <Button
                          type="button"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            setSelectedStation(station);
                            panToGasStation(station);
                          }}
                        >
                          Select
                        </Button>
                      )}
                    </MarkerPopup>
                  </MapMarker>
                ))}
                <MapControls />
                {isFetched && !isFetching && stations.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10 pointer-events-none rounded-xl">
                    <p className="text-sm text-muted-foreground">
                      No nearby gas stations found
                    </p>
                  </div>
                )}
              </Map>
            )}
          </Card>
          {stations.length > 0 && (
            <ScrollArea className="flex-1 min-h-0 max-h-52">
              <div className="space-y-1 pr-4">
                {stations.map((station, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setSelectedStation(station);
                      panToGasStation(station);
                    }}
                    className={`w-full text-left p-2 rounded-md text-sm border transition-colors ${
                      selectedStationValue?.id === station.id
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
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button
            type="button"
            disabled={!selectedStationValue}
            onClick={() => {
              if (selectedStationValue) {
                onSelect(selectedStationValue);
              }
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
