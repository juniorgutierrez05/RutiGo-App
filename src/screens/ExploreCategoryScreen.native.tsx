import React, { useState } from 'react';
import { FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store';
import { BottomNav } from '../components/BottomNav.native';
import { Chip } from '../components/Chip.native';
import { RatingStars } from '../components/RatingStars.native';
import { calculateDistanceKm, formatDistance } from '../services/locationService';
import { CategoryType, Place } from '../types';

export function ExploreCategoryScreen() {
  const { places, activeCategory, setActiveCategory, userLocation, navigateTo, goBack, refreshData } = useApp();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const categories: CategoryType[] = ['cultura', 'gastronomia', 'naturaleza', 'historia'];
  const visible = places.filter((place) => place.category === activeCategory);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const renderHeader = () => (
    <View style={styles.headerWrap}>
      <View style={styles.header}>
        <Pressable onPress={goBack} hitSlop={8}>
          <Ionicons name="chevron-back" size={28} color="#FF7A59" />
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
    </View>
  );

  const renderPlaceItem = ({ item: place }: { item: Place }) => (
    <Pressable
      style={styles.card}
      onPress={() => navigateTo('place_detail', { placeId: place.id })}
    >
      <Image
        source={place.images[0]}
        style={styles.image}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />
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
  );

  return (
    <View style={styles.root}>
      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        renderItem={renderPlaceItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="search-outline" size={40} color="#C4B7B0" />
            <Text style={styles.emptyTitle}>No hay lugares en esta categoría</Text>
            <Text style={styles.emptySubtitle}>Prueba explorando otra categoría o actualiza el catálogo.</Text>
          </View>
        }
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Math.max(insets.top, 20) + 10,
            paddingBottom: 24,
          },
        ]}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={7}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FF7A59']}
            tintColor="#FF7A59"
          />
        }
      />
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFCF8' },
  content: { paddingHorizontal: 16 },
  headerWrap: { marginBottom: 6 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
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
  emptyWrap: {
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyTitle: {
    color: '#1E1927',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 8,
  },
  emptySubtitle: {
    color: '#806F69',
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
