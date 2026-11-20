import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Image } from 'expo-image';
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
        <Text style={styles.pill}>Caribe Colombiano</Text>
        <Text style={styles.pill}>Atlántico</Text>
      </View>

      <View style={styles.center}>
        <View style={[styles.art, { width: artSize, height: artSize }]}>
          <Image
            source={IMAGES.brand.officialMascot}
            style={{ width: mascotSize, height: mascotSize }}
            contentFit="contain"
            transition={200}
            cachePolicy="memory-disk"
          />
        </View>
        <Text style={styles.logo}>
          RUTI<Text style={styles.accent}> GO</Text>
        </Text>
        <Text style={styles.badge}>★ Atlántico Mágico</Text>
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pill: {
    backgroundColor: '#EEF8F1',
    color: '#5DB872',
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
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 14,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  sun: {
    position: 'absolute',
    zIndex: 2,
    right: 12,
    top: 10,
    fontSize: 36,
    color: '#FFD200',
  },
  logo: {
    color: '#E60124',
    fontSize: 40,
    fontWeight: '900',
    marginTop: 18,
    letterSpacing: -0.5,
  },
  accent: {
    color: '#FFD200',
  },
  badge: {
    color: '#1E1927',
    backgroundColor: '#FFFBE6',
    borderWidth: 1,
    borderColor: '#FFD200',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    fontWeight: '900',
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
    backgroundColor: '#F3F4F6',
    padding: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#E60124',
  },
  loading: {
    color: '#E60124',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 10,
  },
  cities: {
    color: '#6B7280',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
});
