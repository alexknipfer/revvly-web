/**
 * TypeScript types for Mapbox Search Box API responses
 * Based on: https://docs.mapbox.com/api/search/search-box/#response-search-for-pois-by-category
 */

// Context types for administrative units
export interface CountryContext {
  id?: string;
  name: string;
  country_code: string;
  country_code_alpha_3: string;
}

export interface RegionContext {
  id?: string;
  name: string;
  region_code?: string;
  region_code_full?: string;
}

export interface PostcodeContext {
  id?: string;
  name: string;
}

export interface DistrictContext {
  id?: string;
  name: string;
}

export interface PlaceContext {
  id?: string;
  name: string;
}

export interface LocalityContext {
  id?: string;
  name: string;
}

export interface NeighborhoodContext {
  id?: string;
  name: string;
}

export interface AddressContext {
  id?: string;
  name: string;
  address_number?: string;
  street_name?: string;
}

export interface StreetContext {
  id?: string;
  name: string;
}

export interface FeatureContext {
  country?: CountryContext;
  region?: RegionContext;
  postcode?: PostcodeContext;
  district?: DistrictContext;
  place?: PlaceContext;
  locality?: LocalityContext;
  neighborhood?: NeighborhoodContext;
  address?: AddressContext;
  street?: StreetContext;
}

// Routable point type
export interface RoutablePoint {
  name: string;
  latitude: number;
  longitude: number;
  note?: string;
}

// Coordinates type
export interface FeatureCoordinates {
  longitude: number;
  latitude: number;
  accuracy?:
    | 'rooftop'
    | 'parcel'
    | 'point'
    | 'interpolated'
    | 'intersection'
    | 'approximate'
    | 'street';
  routable_points?: RoutablePoint[];
}

// Geometry type
export interface FeatureGeometry {
  coordinates: [number, number]; // [longitude, latitude]
  type: 'Point';
}

export interface FeatureProperties {
  name: string;
  mapbox_id: string;
  feature_type: string;
  context: FeatureContext;
  coordinates: FeatureCoordinates;
  name_preferred?: string;
  address?: string;
  full_address?: string;
  place_formatted?: string;
  bbox?: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
  language?: string;
  maki?: string;
  poi_category?: string[];
  poi_category_ids?: string[];
  brand?: string[];
  brand_id?: string[];
  external_ids?: Record<string, string>;
  metadata?: Record<string, unknown>;
}

export interface SearchBoxFeature {
  type: 'Feature';
  geometry: FeatureGeometry;
  properties: FeatureProperties;
}

export interface SearchBoxFeatureCollection {
  type: 'FeatureCollection';
  features: SearchBoxFeature[];
  attribution: string;
}
