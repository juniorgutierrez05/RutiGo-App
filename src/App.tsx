/**
 * RutiGo - Turismo en el Atlántico, Colombia
 * Main Application Component with Screen Navigator
 */
import React from 'react';
import { AppProvider, useApp } from './store';
import { SplashScreen } from './screens/SplashScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ExploreCategoryScreen } from './screens/ExploreCategoryScreen';
import { SearchScreen } from './screens/SearchScreen';
import { SearchResultsScreen } from './screens/SearchResultsScreen';
import { RouteDetailScreen } from './screens/RouteDetailScreen';
import { PlaceDetailScreen } from './screens/PlaceDetailScreen';
import { InteractiveMapScreen } from './screens/InteractiveMapScreen';
import { NearbyRoutesScreen } from './screens/NearbyRoutesScreen';
import { ReviewsScreen } from './screens/ReviewsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { FavoritesScreen } from './screens/FavoritesScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { RecommendationsScreen } from './screens/RecommendationsScreen';

const ScreenRouter: React.FC = () => {
  const { currentScreen } = useApp();

  switch (currentScreen) {
    case 'splash':
      return <SplashScreen />;
    case 'onboarding':
      return <OnboardingScreen />;
    case 'login':
      return <LoginScreen />;
    case 'register':
      return <RegisterScreen />;
    case 'home':
      return <HomeScreen />;
    case 'explore_category':
      return <ExploreCategoryScreen />;
    case 'search':
      return <SearchScreen />;
    case 'search_results':
      return <SearchResultsScreen />;
    case 'route_detail':
      return <RouteDetailScreen />;
    case 'place_detail':
      return <PlaceDetailScreen />;
    case 'interactive_map':
      return <InteractiveMapScreen />;
    case 'nearby_routes':
      return <NearbyRoutesScreen />;
    case 'reviews':
      return <ReviewsScreen />;
    case 'profile':
      return <ProfileScreen />;
    case 'favorites':
      return <FavoritesScreen />;
    case 'settings':
      return <SettingsScreen />;
    case 'notifications':
      return <NotificationsScreen />;
    case 'recommendations':
      return <RecommendationsScreen />;
    default:
      return <HomeScreen />;
  }
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#F7F2EC] flex justify-center items-center px-0">
        {/* Mobile Viewport Container */}
        <div className="mobile-shell w-full max-w-[420px] min-h-screen bg-background shadow-2xl relative overflow-x-hidden flex flex-col font-body text-on-surface">
          <ScreenRouter />
        </div>
      </div>
    </AppProvider>
  );
}
