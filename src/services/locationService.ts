/**
 * Location Service for RutiGo
 * Real GPS coordinates, Haversine distance calculations, and Atlántico municipalities
 */
import { PlaceLocation } from '../types';
import * as Location from 'expo-location';

export const ATLANTICO_MUNICIPALITIES: Record<string, PlaceLocation> = {
  'Puerto Colombia': { lat: 10.9882, lng: -74.9554 },
  'Barranquilla': { lat: 10.9685, lng: -74.7813 },
  'Usiacurí': { lat: 10.7431, lng: -74.9542 },
  'Baranoa': { lat: 10.7951, lng: -74.9124 },
  'Tubará': { lat: 10.8765, lng: -74.9754 },
  'Piojó': { lat: 10.7485, lng: -75.1098 },
  'Galapa': { lat: 10.8987, lng: -74.8876 },
  'Luruaco': { lat: 10.6121, lng: -75.1432 },
  'Polonuevo': { lat: 10.7789, lng: -74.8562 },
  'Soledad': { lat: 10.9185, lng: -74.7645 },
};

/**
 * Calculates distance in kilometers between two geographic points using Haversine formula
 */
export function calculateDistanceKm(
  point1: PlaceLocation,
  point2: PlaceLocation
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((point2.lat - point1.lat) * Math.PI) / 180;
  const dLng = ((point2.lng - point1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((point1.lat * Math.PI) / 180) *
      Math.cos((point2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Formats distance into human-readable string ('450 m' or '3.2 km')
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Estimates walking and driving time based on distance
 */
export function estimateTravelTimes(distanceKm: number): {
  walkingText: string;
  drivingText: string;
} {
  const walkingMins = Math.max(1, Math.round((distanceKm / 4.5) * 60));
  const drivingMins = Math.max(1, Math.round((distanceKm / 40) * 60));

  const walkingText =
    walkingMins > 60
      ? `${Math.floor(walkingMins / 60)}h ${walkingMins % 60}m a pie`
      : `${walkingMins} min a pie`;

  const drivingText =
    drivingMins > 60
      ? `${Math.floor(drivingMins / 60)}h ${drivingMins % 60}m en auto`
      : `${drivingMins} min en auto`;

  return { walkingText, drivingText };
}

/**
 * Requests user device geolocation with safety fallback
 */
export function getCurrentCoordinates(): Promise<PlaceLocation> {
  return Location.requestForegroundPermissionsAsync()
    .then(({ status }) => {
      if (status !== Location.PermissionStatus.GRANTED) {
        return ATLANTICO_MUNICIPALITIES['Puerto Colombia'];
      }
      return Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
        .then(({ coords }) => ({ lat: coords.latitude, lng: coords.longitude }))
        .catch(() => ATLANTICO_MUNICIPALITIES['Puerto Colombia']);
    })
    .catch(() => ATLANTICO_MUNICIPALITIES['Puerto Colombia']);
}
