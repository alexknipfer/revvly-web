export interface GoogleLocation {
  latitude: number;
  longitude: number;
}

export interface GoogleDisplayName {
  text: string;
  languageCode: string;
}

export interface GooglePlace {
  formattedAddress: string;
  location: GoogleLocation;
  displayName: GoogleDisplayName;
}

export interface GooglePlacesNearbyResponse {
  places: Array<GooglePlace>;
}
