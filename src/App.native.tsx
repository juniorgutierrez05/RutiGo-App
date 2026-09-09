import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  const webSource = {
    uri: 'http://192.168.101.94:3000/index.html',
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
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
