/**
 * RutiGo Data Models & Interfaces (Firestore Schema)
 */

export type CategoryType = 'cultura' | 'gastronomia' | 'naturaleza' | 'historia';

export interface User {
  id: string;
  name: string;
  email: string;
  homeCity: string;
  avatarUrl: string;
  savedRoutes: string[];
  savedPlaces: string[];
  createdAt: string;
}

export interface Route {
  id: string;
  name: string;
  subtitle?: string;
  description: string;
  category: CategoryType;
  municipalities: string[];
  durationEstimate: string;
  distanceKm: number;
  difficulty: 'Fácil' | 'Moderado' | 'Avanzado';
  coverImageUrl: string;
  placeIds: string[];
  avgRating: number;
  reviewCount: number;
  priceSuggested?: string;
  highlights?: string[];
  tips?: string;
  createdAt: string;
}

export interface PlaceLocation {
  lat: number;
  lng: number;
}

export interface Place {
  id: string;
  name: string;
  description: string;
  category: CategoryType;
  municipality: string;
  location: PlaceLocation;
  address?: string;
  schedule: string;
  images: string[];
  avgRating: number;
  reviewCount: number;
  estimatedTime?: string;
  tag?: string;
  priceNote?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  placeId?: string;
  routeId?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1 - 5
  comment: string;
  photoUrl?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'new_route' | 'review_reply' | 'recommendation';
  title: string;
  body: string;
  read: boolean;
  relatedId?: string;
  createdAt: string;
}

export type ScreenName =
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'register'
  | 'home'
  | 'explore_category'
  | 'search'
  | 'search_results'
  | 'route_detail'
  | 'place_detail'
  | 'interactive_map'
  | 'nearby_routes'
  | 'reviews'
  | 'profile'
  | 'favorites'
  | 'settings'
  | 'notifications'
  | 'recommendations';
