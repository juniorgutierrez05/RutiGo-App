/**
 * Central State Management for RutiGo
 * Provides React Context store with persistence and asynchronous sync
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Route, Place, Review, NotificationItem, CategoryType, ScreenName, PlaceLocation } from '../types';
import * as fb from '../services/api';
import { getCurrentCoordinates, ATLANTICO_MUNICIPALITIES } from '../services/locationService';

interface AppContextType {
  // Navigation
  currentScreen: ScreenName;
  screenHistory: ScreenName[];
  navigateTo: (screen: ScreenName, params?: { routeId?: string; placeId?: string; category?: CategoryType }) => void;
  goBack: () => void;

  // Authentication
  currentUser: User | null;
  login: (email: string, pass: string) => Promise<void>;
  loginGoogle: (idToken: string) => Promise<void>;
  register: (name: string, email: string, pass: string, homeCity: string) => Promise<void>;
  logout: () => Promise<void>;

  // Data
  routes: Route[];
  places: Place[];
  reviews: Review[];
  notifications: NotificationItem[];
  selectedRoute: Route | null;
  selectedPlace: Place | null;
  activeCategory: CategoryType;
  setActiveCategory: (cat: CategoryType) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  removeRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;

  // Location
  userLocation: PlaceLocation;
  locationName: string;
  refreshLocation: () => Promise<void>;
  setLocationName: (name: string) => void;

  // Actions
  toggleFavorite: (type: 'route' | 'place', id: string) => Promise<void>;
  isFavorite: (type: 'route' | 'place', id: string) => boolean;
  addReview: (placeId: string, rating: number, comment: string, photoUrl?: string) => Promise<void>;
  editReview: (reviewId: string, rating: number, comment: string) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  unreadNotifsCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation stack
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('splash');
  const [screenHistory, setScreenHistory] = useState<ScreenName[]>(['splash']);

  // Auth
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    let cancelled = false;
    fb.getCurrentUser().then((user) => {
      if (!cancelled) setCurrentUser(user);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (currentUser) {
      fb.validateSession().catch(async () => {
        await fb.logoutUser();
        setCurrentUser(null);
      });
    }
  }, [currentUser]);

  // Core Data
  const [routes, setRoutes] = useState<Route[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Selections
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>('route_usiacuri');
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>('place_usiacuri_murales');
  const [activeCategory, setActiveCategory] = useState<CategoryType>('gastronomia');

  // Search
  const [searchQuery, setSearchQuery] = useState<string>('Usiacurí');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Usiacurí',
    'Ruta del Girasol',
    'Castillo de Salgar',
    'Muelle 1888',
    'Mirador de Piojó',
  ]);

  // Geolocation
  const [userLocation, setUserLocation] = useState<PlaceLocation>(ATLANTICO_MUNICIPALITIES['Puerto Colombia']);
  const [locationName, setLocationName] = useState<string>('Puerto Colombia');

  // Initial fetch
  useEffect(() => {
    async function loadInitialData() {
      const [allRoutes, allPlaces, allReviews, allNotifs] = await Promise.all([
        fb.getRoutes(),
        fb.getPlaces(),
        fb.getReviews(),
        currentUser ? fb.getNotifications() : Promise.resolve([]),
      ]);
      setRoutes(allRoutes);
      setPlaces(allPlaces);
      setReviews(allReviews);
      setNotifications(allNotifs);

      // Attempt coordinates
      const coords = await getCurrentCoordinates();
      setUserLocation(coords);
    }
    loadInitialData();
  }, [currentUser]);

  const refreshLocation = async () => {
    const coords = await getCurrentCoordinates();
    setUserLocation(coords);
  };

  // Navigation handlers
  const navigateTo = (
    screen: ScreenName,
    params?: { routeId?: string; placeId?: string; category?: CategoryType }
  ) => {
    if (params?.routeId) setSelectedRouteId(params.routeId);
    if (params?.placeId) setSelectedPlaceId(params.placeId);
    if (params?.category) setActiveCategory(params.category);

    setScreenHistory((prev) => [...prev, screen]);
    setCurrentScreen(screen);
  };

  const goBack = () => {
    if (screenHistory.length > 1) {
      const newHistory = [...screenHistory];
      newHistory.pop();
      const prevScreen = newHistory[newHistory.length - 1];
      setScreenHistory(newHistory);
      setCurrentScreen(prevScreen);
    } else {
      setCurrentScreen('home');
    }
  };

  // Auth Handlers
  const login = async (email: string, pass: string) => {
    const user = await fb.loginWithEmail(email, pass);
    setCurrentUser(user);
    navigateTo(user.role === 'admin' ? 'admin' : 'home');
  };

  const loginGoogle = async (idToken: string) => {
    const user = await fb.loginWithGoogle(idToken);
    setCurrentUser(user);
    navigateTo(user.role === 'admin' ? 'admin' : 'home');
  };

  const register = async (name: string, email: string, pass: string, homeCity: string) => {
    const user = await fb.registerWithEmail(name, email, pass, homeCity);
    setCurrentUser(user);
    navigateTo('home');
  };

  const logout = async () => {
    await fb.logoutUser();
    setCurrentUser(null);
    navigateTo('login');
  };

  // Favorites
  const toggleFavorite = async (type: 'route' | 'place', id: string) => {
    if (!currentUser) {
      navigateTo('login');
      return;
    }
    const updated = await fb.toggleFavorite(type, id, currentUser);
    setCurrentUser(updated);
  };

  const isFavorite = (type: 'route' | 'place', id: string): boolean => {
    if (!currentUser) return false;
    return type === 'route'
      ? currentUser.savedRoutes.includes(id)
      : currentUser.savedPlaces.includes(id);
  };

  // Reviews CRUD
  const addReview = async (placeId: string, rating: number, comment: string, photoUrl?: string) => {
    if (!currentUser) return;
    const newRev = await fb.createReview({
      placeId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatarUrl,
      rating,
      comment,
      photoUrl,
    });
    setReviews((prev) => [newRev, ...prev]);

    // Refresh places to get updated avgRating
    try {
      const updatedPlaces = await fb.getPlaces();
      setPlaces(updatedPlaces);
    } catch (refreshError) {
      console.warn('La reseña se guardó, pero no se pudo actualizar el catálogo:', refreshError);
    }
  };

  const editReview = async (reviewId: string, rating: number, comment: string) => {
    const updatedRev = await fb.updateReview(reviewId, rating, comment);
    setReviews((prev) => prev.map((r) => (r.id === reviewId ? updatedRev : r)));
    const updatedPlaces = await fb.getPlaces();
    setPlaces(updatedPlaces);
  };

  const deleteReview = async (reviewId: string) => {
    await fb.deleteReview(reviewId);
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    const updatedPlaces = await fb.getPlaces();
    setPlaces(updatedPlaces);
  };

  // Search History
  const addRecentSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => [trimmed, ...prev.filter((q) => q.toLowerCase() !== trimmed.toLowerCase())]);
  };

  const removeRecentSearch = (term: string) => {
    setRecentSearches((prev) => prev.filter((q) => q !== term));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  // Notifications
  const markNotificationRead = async (id: string) => {
    await fb.markNotificationAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const selectedRoute = routes.find((r) => r.id === selectedRouteId) || routes[0] || null;
  const selectedPlace = places.find((p) => p.id === selectedPlaceId) || places[0] || null;

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        screenHistory,
        navigateTo,
        goBack,
        currentUser,
        login,
        loginGoogle,
        register,
        logout,
        routes,
        places,
        reviews,
        notifications,
        selectedRoute,
        selectedPlace,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        recentSearches,
        addRecentSearch,
        removeRecentSearch,
        clearRecentSearches,
        userLocation,
        locationName,
        refreshLocation,
        setLocationName,
        toggleFavorite,
        isFavorite,
        addReview,
        editReview,
        deleteReview,
        markNotificationRead,
        unreadNotifsCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
