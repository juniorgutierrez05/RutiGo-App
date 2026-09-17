import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

function NativeShell() {
  const insets = useSafeAreaInsets();
  const webSource = {
    uri: process.env.EXPO_PUBLIC_WEB_URL || 'http://192.168.1.38:3000/index.html',
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <StatusBar style="dark" />
      <WebView
        originWhitelist={['*']}
        source={webSource}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        mixedContentMode="compatibility"
        style={styles.webview}
      />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NativeShell />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFCF8',
  },
  webview: {
    flex: 1,
    backgroundColor: '#FFFCF8',
  },
});
