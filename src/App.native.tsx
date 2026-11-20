import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationBar } from 'expo-navigation-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './store';
import { NativeRouter } from './NativeRouter';
import { StatusBarScrim } from './components/StatusBarScrim.native';
import { ServerStatusBanner } from './components/ServerStatusBanner.native';
import { UpdateNotificationBanner } from './components/UpdateNotificationBanner.native';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <NavigationBar style="light" />
      <AppProvider>
        <NativeRouter />
        <UpdateNotificationBanner />
        <ServerStatusBanner />
        <StatusBarScrim />
      </AppProvider>
    </SafeAreaProvider>
  );
}
