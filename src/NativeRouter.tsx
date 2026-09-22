import React from 'react';
import { View } from 'react-native';
import { useApp } from './store';
import { SplashScreen } from './screens/SplashScreen.native';
import { OnboardingScreen } from './screens/OnboardingScreen.native';
import { LoginScreen } from './screens/LoginScreen.native';
import { RegisterScreen } from './screens/RegisterScreen.native';
import { HomeScreen } from './screens/HomeScreen.native';
import { ExploreCategoryScreen } from './screens/ExploreCategoryScreen.native';
import { SearchScreen } from './screens/SearchScreen.native';
import { SearchResultsScreen } from './screens/SearchResultsScreen.native';
import { RouteDetailScreen } from './screens/RouteDetailScreen.native';
import { PlaceDetailScreen } from './screens/PlaceDetailScreen.native';
import { InteractiveMapScreen } from './screens/InteractiveMapScreen.native';
import { NearbyRoutesScreen } from './screens/NearbyRoutesScreen.native';
import { ReviewsScreen } from './screens/ReviewsScreen.native';
import { ProfileScreen } from './screens/ProfileScreen.native';
import { FavoritesScreen } from './screens/FavoritesScreen.native';
import { SettingsScreen } from './screens/SettingsScreen.native';
import { NotificationsScreen } from './screens/NotificationsScreen.native';
import { RecommendationsScreen } from './screens/RecommendationsScreen.native';
import { AdminScreen } from './screens/AdminScreen.native';

export function NativeRouter() {
  const { currentScreen } = useApp();
  switch (currentScreen) {
    case 'splash': return <SplashScreen />;
    case 'onboarding': return <OnboardingScreen />;
    case 'login': return <LoginScreen />;
    case 'register': return <RegisterScreen />;
    case 'home': return <HomeScreen />;
    case 'explore_category': return <ExploreCategoryScreen />;
    case 'search': return <SearchScreen />;
    case 'search_results': return <SearchResultsScreen />;
    case 'route_detail': return <RouteDetailScreen />;
    case 'place_detail': return <PlaceDetailScreen />;
    case 'interactive_map': return <InteractiveMapScreen />;
    case 'nearby_routes': return <NearbyRoutesScreen />;
    case 'reviews': return <ReviewsScreen />;
    case 'profile': return <ProfileScreen />;
    case 'favorites': return <FavoritesScreen />;
    case 'settings': return <SettingsScreen />;
    case 'notifications': return <NotificationsScreen />;
    case 'recommendations': return <RecommendationsScreen />;
    case 'admin': return <AdminScreen />;
    default: return <View />;
  }
}
