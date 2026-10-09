import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store';
import { IMAGES } from '../assets/images';

export function SplashScreen() {
  const { navigateTo } = useApp();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [progress, setProgress] = useState(25);

  const artSize = Math.min(width * 0.70, height * 0.32, 270);
  const mascotSize = artSize * 0.88;

  useEffect(() => {
    const first = setTimeout(() => setProgress(65), 500);
    const second = setTimeout(() => setProgress(100), 1400);
    const finish = setTimeout(() => navigateTo('onboarding'), 2200);
    return () => {
      clearTimeout(first);
      clearTimeout(second);
      clearTimeout(finish);
    };
  }, [navigateTo]);

  return (
    <Pressable
      style={[
        styles.root,
        {
          paddingTop: Math.max(insets.top, 20) + 10,
          paddingBottom: Math.max(insets.bottom, 16) + 16,
        },
      ]}
      onPress={() => navigateTo('onboarding')}
    >
      <View style={styles.header}>
        <Text style={styles.pill}>◉ Caribe Colombiano</Text>
        <Text style={styles.pill}>● Atlántico</Text>
      </View>

      <View style={styles.center}>
        <View style={[styles.art, { width: artSize, height: artSize }]}>
          <Text style={styles.sun}>☀</Text>
          <Image source={{ uri: IMAGES.mascot.iguanaMain }} style={{ width: mascotSize, height: mascotSize }} />
        </View>
        <Text style={styles.logo}>
          Ruti<Text style={styles.accent}>Go</Text>
        </Text>
        <Text style={styles.badge}>✓ Atlántico Mágico</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.loading}>◌ Cargando rutas del Caribe...</Text>
        <Text style={styles.cities}>Barranquilla • Puerto Colombia • Usiacurí</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F9F1FF',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pill: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    color: '#00696E',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    fontSize: 11,
    fontWeight: '800',
  },
  center: {
    alignItems: 'center',
  },
  art: {
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1E1927',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  sun: {
    position: 'absolute',
    zIndex: 2,
    right: 12,
    top: 10,
    fontSize: 42,
  },
  logo: {
    color: '#1E1927',
    fontSize: 42,
    fontWeight: '900',
    marginTop: 18,
  },
  accent: {
    color: '#FF7A59',
  },
  badge: {
    color: '#1E1927',
    backgroundColor: '#EEE4F9',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    fontWeight: '800',
    marginTop: 8,
    fontSize: 12,
  },
  footer: {
    alignItems: 'center',
  },
  track: {
    width: '100%',
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    padding: 2,
  },
  fill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: '#FF7A59',
  },
  loading: {
    color: '#806F69',
    marginTop: 12,
    fontWeight: '700',
    fontSize: 13,
  },
  cities: {
    color: '#8B716B',
    fontSize: 11,
    marginTop: 10,
  },
});
