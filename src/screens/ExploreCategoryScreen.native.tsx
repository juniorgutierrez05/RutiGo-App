import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store';
import { BottomNav } from '../components/BottomNav.native';
import { Chip } from '../components/Chip.native';
import { RatingStars } from '../components/RatingStars.native';
import { calculateDistanceKm, formatDistance } from '../services/locationService';
import { CategoryType } from '../types';

export function ExploreCategoryScreen() {
  const { places, activeCategory, setActiveCategory, userLocation, navigateTo } = useApp();
  const insets = useSafeAreaInsets();
  const categories: CategoryType[] = ['cultura', 'gastronomia', 'naturaleza', 'historia'];
  const visible = places.filter((place) => place.category === activeCategory);

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Math.max(insets.top, 20) + 10,
            paddingBottom: 24,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable onPress={() => navigateTo('home')} hitSlop={8}>
            <Text style={styles.back}>‹</Text>
          </Pressable>
          <Text style={styles.title}>Explorar</Text>
        </View>
        <Text style={styles.subtitle}>Encuentra tu próxima experiencia en el Atlántico.</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {categories.map((category) => (
            <Chip
              key={category}
              label={category[0].toUpperCase() + category.slice(1)}
              category={category}
              selected={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            />
          ))}
        </ScrollView>

        <Text style={styles.count}>{visible.length} lugares encontrados</Text>

        {visible.map((place) => (
          <Pressable
            key={place.id}
            style={styles.card}
            onPress={() => navigateTo('place_detail', { placeId: place.id })}
          >
            <Image source={{ uri: place.images[0] }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.municipality}>{place.municipality}</Text>
              <Text style={styles.name} numberOfLines={1}>{place.name}</Text>
              <Text style={styles.description} numberOfLines={2}>{place.description}</Text>
              <View style={styles.meta}>
                <RatingStars rating={place.avgRating} showBadge />
                <Text style={styles.distance}>{formatDistance(calculateDistanceKm(userLocation, place.location))}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFCF8' },
  content: { paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  back: { color: '#FF7A59', fontSize: 32, marginTop: -2 },
  title: { color: '#1E1927', fontSize: 26, fontWeight: '900' },
  subtitle: { color: '#806F69', fontSize: 14, lineHeight: 21, marginTop: 4 },
  chips: { gap: 8, paddingVertical: 14 },
  count: { color: '#806F69', fontSize: 13, marginBottom: 12, fontWeight: '700' },
  card: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0E4DC',
    marginBottom: 12,
    shadowColor: '#1E1927',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  image: { width: 95, height: 110, borderRadius: 14 },
  info: { flex: 1, paddingLeft: 12, justifyContent: 'center' },
  municipality: { color: '#FF7A59', fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  name: { color: '#1E1927', fontSize: 16, fontWeight: '900', marginTop: 3 },
  description: { color: '#806F69', fontSize: 12, lineHeight: 17, marginTop: 3 },
  meta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  distance: { color: '#00AEB7', fontSize: 11, fontWeight: '800' },
});
