/**
 * Central State Management for RutiGo
 * Provides React Context store with persistence and asynchronous sync
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, Route, Place, Review, NotificationItem, CategoryType, ScreenName, PlaceLocation } from '../types';
import * as api from '../services/api';
import { getCurrentCoordinates, ATLANTICO_MUNICIPALITIES } from '../services/locationService';

interface AppContextType {
  // Navigation
  currentScreen: ScreenName;
  screenHistory: ScreenName[];
  navigateTo: (screen: ScreenName, params?: { routeId?: string; placeId?: string; category?: CategoryType }) => void;
  goBack: () => boolean;

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
  isLoading: boolean;
  isServerWaking: boolean;
  refreshData: () => Promise<void>;
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
    api.getCurrentUser().then((user) => {
      if (!cancelled && user) {
        setCurrentUser(user);
      }
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (currentUser?.id) {
      api.validateSession()
        .then((freshUser: any) => {
          if (freshUser?.id) {
            setCurrentUser((prev) => (prev ? { ...prev, ...freshUser } : freshUser));
          }
        })
        .catch(async (err: any) => {
          // SOLO cerramos sesión si el servidor explícitamente responde 401 (token expirado o revocado)
          const is401 = err?.status === 401 || err?.message?.includes('401') || err?.message === 'Autenticación requerida' || err?.message === 'Sesión inválida';
          if (is401) {
            console.warn('[RutiGo Auth] Token revocado o expirado por el servidor. Cerrando sesión.');
            await api.logoutUser();
            setCurrentUser(null);
          } else {
            console.log('[RutiGo Auth] No se pudo verificar sesión con el servidor (sin conexión o servidor en espera). Manteniendo sesión guardada localmente.');
          }
        });
    }
  }, [currentUser?.id]);

  // Core Data
  const [routes, setRoutes] = useState<Route[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Selections
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isServerWaking, setIsServerWaking] = useState<boolean>(false);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    // Si la carga tarda más de 2.2 segundos (Cold start de Render), avisamos en UI de forma no intrusiva
    const wakeTimer = setTimeout(() => {
      setIsServerWaking(true);
    }, 2200);

    try {
      const [allRoutes, allPlaces, allReviews, allNotifs] = await Promise.all([
        api.getRoutes(),
        api.getPlaces(),
        api.getReviews(),
        currentUser ? api.getNotifications() : Promise.resolve([]),
      ]);
      setRoutes(allRoutes);
      setPlaces(allPlaces);
      setReviews(allReviews);
      setNotifications(allNotifs);
    } catch (e) {
      console.warn('Error refreshing data:', e);
    } finally {
      clearTimeout(wakeTimer);
      setIsServerWaking(false);
      setIsLoading(false);
    }
  }, [currentUser]);

  // Client Keep-Alive Heartbeat: cada 10 min mientras la app esté abierta para evitar cold start de Render
  useEffect(() => {
    const keepAliveTimer = setInterval(() => {
      api.pingServerHealth();
    }, 10 * 60 * 1000);
    return () => clearInterval(keepAliveTimer);
  }, []);

  // Initial fetch
  useEffect(() => {
    refreshData().then(async () => {
      const coords = await getCurrentCoordinates();
      setUserLocation(coords);
    });
  }, [refreshData]);

  const refreshLocation = useCallback(async () => {
    const coords = await getCurrentCoordinates();
    setUserLocation(coords);
  }, []);

  const navigateTo = (
    screen: ScreenName,
    params?: { routeId?: string; placeId?: string; category?: CategoryType }
  ) => {
    if (params?.routeId) setSelectedRouteId(params.routeId);
    if (params?.placeId) setSelectedPlaceId(params.placeId);
    else if (screen === 'interactive_map') setSelectedPlaceId(null);
    if (params?.category) setActiveCategory(params.category);

    setScreenHistory((prev) => {
      // Si navegamos a 'home' desde pantallas de inicio, reiniciamos el stack en 'home'
      if (screen === 'home') {
        return ['home'];
      }
      // Evitar empujar dos veces la misma pantalla consecutiva
      if (prev[prev.length - 1] === screen) {
        return prev;
      }
      // Si venimos de splash u onboarding a login, reemplazamos en vez de apilar
      if (prev.length === 1 && (prev[0] === 'splash' || prev[0] === 'onboarding')) {
        return [screen];
      }
      return [...prev, screen];
    });
    setCurrentScreen(screen);
  };

  const goBack = (): boolean => {
    if (screenHistory.length > 1) {
      const newHistory = [...screenHistory];
      newHistory.pop();
      const prevScreen = newHistory[newHistory.length - 1];
      setScreenHistory(newHistory);
      setCurrentScreen(prevScreen);
      return true;
    }
    if (currentScreen !== 'home') {
      setScreenHistory(['home']);
      setCurrentScreen('home');
      return true;
    }
    return false;
  };

  // Auth Handlers
  const login = async (email: string, pass: string) => {
    const user = await api.loginWithEmail(email, pass);
    setCurrentUser(user);
    navigateTo(user.role === 'admin' ? 'admin' : 'home');
  };

  const loginGoogle = async (idToken: string) => {
    const user = await api.loginWithGoogle(idToken);
    setCurrentUser(user);
    navigateTo(user.role === 'admin' ? 'admin' : 'home');
  };

  const register = async (name: string, email: string, pass: string, homeCity: string) => {
    const user = await api.registerWithEmail(name, email, pass, homeCity);
    setCurrentUser(user);
    navigateTo('home');
  };

  const logout = async () => {
    await api.logoutUser();
    setCurrentUser(null);
    navigateTo('login');
  };

  // Favorites
  const toggleFavorite = async (type: 'route' | 'place', id: string) => {
    if (!currentUser) {
      navigateTo('login');
      return;
    }
    const updated = await api.toggleFavorite(type, id, currentUser);
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
    const newRev = await api.createReview({
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
      const updatedPlaces = await api.getPlaces();
      setPlaces(updatedPlaces);
    } catch (refreshError) {
      console.warn('La reseña se guardó, pero no se pudo actualizar el catálogo:', refreshError);
    }
  };

  const editReview = async (reviewId: string, rating: number, comment: string) => {
    const updatedRev = await api.updateReview(reviewId, rating, comment);
    setReviews((prev) => prev.map((r) => (r.id === reviewId ? updatedRev : r)));
    const updatedPlaces = await api.getPlaces();
    setPlaces(updatedPlaces);
  };

  const deleteReview = async (reviewId: string) => {
    await api.deleteReview(reviewId);
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    const updatedPlaces = await api.getPlaces();
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
    await api.markNotificationAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const selectedRoute = selectedRouteId ? routes.find((r) => r.id === selectedRouteId) || routes[0] || null : routes[0] || null;
  const selectedPlace = selectedPlaceId ? places.find((p) => p.id === selectedPlaceId) || null : null;

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
        isLoading,
        isServerWaking,
        refreshData,
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
