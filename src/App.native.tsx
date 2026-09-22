import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './store';
import { NativeRouter } from './NativeRouter';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AppProvider>
        <NativeRouter />
      </AppProvider>
    </SafeAreaProvider>
  );
}
