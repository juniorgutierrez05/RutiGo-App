import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './store';
import { NativeRouter } from './NativeRouter';
import { StatusBarScrim } from './components/StatusBarScrim.native';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AppProvider>
        <NativeRouter />
        <StatusBarScrim />
      </AppProvider>
    </SafeAreaProvider>
  );
}
