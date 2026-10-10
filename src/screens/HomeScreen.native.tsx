import React, { useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store';
import { BottomNav } from '../components/BottomNav.native';
import { Card } from '../components/Card.native';
import { Chip } from '../components/Chip.native';
import { TopAppBar } from '../components/TopAppBar.native';
import { calculateDistanceKm, formatDistance } from '../services/locationService';
import { CategoryType } from '../types';

export function HomeScreen() {
  const {
    routes,
    places,
    navigateTo,
    activeCategory,
    setActiveCategory,
    userLocation,
    toggleFavorite,
    isFavorite,
    isLoading,
    refreshData,
  } = useApp();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const featuredRoute = routes[0];

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const select = (category: CategoryType) => {
    setActiveCategory(category);
    navigateTo('explore_category', { category });
  };

  return (
    <View style={styles.root}>
      <TopAppBar title="Barranquilla & Atlántico" subtitle="Guía costera activa" showNotifications />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 24 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FF7A59']}
            tintColor="#FF7A59"
          />
        }
      >
        <Pressable style={styles.search} onPress={() => navigateTo('search')}>
          <Ionicons name="search-outline" size={20} color="#FF7A59" style={styles.searchIcon} />
          <Text style={styles.searchText}>Buscar rutas, gastronomía, lugares...</Text>
        </Pressable>

        <View style={styles.heading}>
          <Text style={styles.sectionTitle}>Explorar por categoría</Text>
          <Pressable onPress={() => navigateTo('explore_category')} hitSlop={8}>
            <Text style={styles.link}>Ver todas</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          <Chip label="Cultura" category="cultura" selected={activeCategory === 'cultura'} onClick={() => select('cultura')} />
          <Chip label="Gastronomía" category="gastronomia" selected={activeCategory === 'gastronomia'} onClick={() => select('gastronomia')} />
          <Chip label="Naturaleza" category="naturaleza" selected={activeCategory === 'naturaleza'} onClick={() => select('naturaleza')} />
          <Chip label="Historia" category="historia" selected={activeCategory === 'historia'} onClick={() => select('historia')} />
        </ScrollView>

        {featuredRoute ? (
          <View style={styles.featuredSection}>
            <View style={styles.heading}>
              <Text style={styles.sectionTitle}>Ruta de la semana</Text>
              <Text style={styles.link}>Recomendado</Text>
            </View>
            <View style={styles.featuredCardWrap}>
              <Card rounded="2xl" padding="none" interactive onPress={() => navigateTo('route_detail', { routeId: featuredRoute.id })}>
                <View style={styles.routeImageWrap}>
                  <Image
                    source={featuredRoute.coverImageUrl}
                    style={styles.routeImage}
                    contentFit="cover"
                    transition={200}
                    cachePolicy="memory-disk"
                  />
                  <View style={styles.routeShade} />
                  <View style={styles.routeText}>
                    <Text style={styles.routeTag}>IMPERDIBLE</Text>
                    <Text style={styles.routeName} numberOfLines={2}>{featuredRoute.name}</Text>
                    <Text style={styles.routeMeta}>{featuredRoute.durationEstimate} · {featuredRoute.distanceKm} km</Text>
                  </View>
                  <Pressable
                    style={styles.favorite}
                    hitSlop={8}
                    onPress={() => toggleFavorite('route', featuredRoute.id)}
                  >
                    <Ionicons
                      name={isFavorite('route', featuredRoute.id) ? 'heart' : 'heart-outline'}
                      size={20}
                      color={isFavorite('route', featuredRoute.id) ? '#FF4D4D' : '#806F69'}
                    />
                  </Pressable>
                </View>
              </Card>
            </View>
          </View>
        ) : isLoading ? (
          <View style={[styles.featuredCardWrap, { marginTop: 16 }]}>
            <View style={[styles.routeImageWrap, styles.skeletonBox]}>
              <ActivityIndicator color="#FF7A59" size="large" />
            </View>
          </View>
        ) : null}

        <View style={styles.heading}>
          <Text style={styles.sectionTitle}>Lugares cercanos</Text>
          <Pressable onPress={() => navigateTo('interactive_map')} hitSlop={8}>
            <Text style={styles.link}>Ver mapa</Text>
          </Pressable>
        </View>

        {places.length === 0 && isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color="#FF7A59" size="small" />
            <Text style={styles.loadingText}>Cargando experiencias...</Text>
          </View>
        ) : (
          places.slice(0, 6).map((place) => (
            <Pressable
              key={place.id}
              style={styles.place}
              onPress={() => navigateTo('place_detail', { placeId: place.id })}
            >
              <Image
                source={place.images[0]}
                style={styles.placeImage}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
              />
              <View style={styles.placeInfo}>
                <Text style={styles.municipality}>{place.municipality.toUpperCase()}</Text>
                <Text style={styles.placeName} numberOfLines={1}>{place.name}</Text>
                <Text style={styles.placeDescription} numberOfLines={2}>{place.description}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.distance}>
                    {formatDistance(calculateDistanceKm(userLocation, place.location))}
                  </Text>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={11} color="#F59E0B" />
                    <Text style={styles.ratingText}>{place.avgRating.toFixed(1)}</Text>
                  </View>
                </View>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFCF8',
  },
  content: {
    paddingTop: 10,
  },
  search: {
    marginHorizontal: 16,
    marginTop: 10,
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0E4DC',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#1E1927',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  searchIcon: {
    color: '#FF7A59',
    fontSize: 24,
    marginRight: 10,
  },
  searchText: {
    color: '#806F69',
    fontSize: 14,
    flex: 1,
  },
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#1E1927',
    fontSize: 18,
    fontWeight: '900',
  },
  link: {
    color: '#FF7A59',
    fontSize: 13,
    fontWeight: '800',
  },
  chips: {
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  featuredSection: {
    marginTop: 4,
  },
  featuredCardWrap: {
    paddingHorizontal: 16,
  },
  routeImageWrap: {
    height: 200,
    position: 'relative',
    borderRadius: 24,
    overflow: 'hidden',
  },
  routeImage: {
    width: '100%',
    height: '100%',
  },
  routeShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  routeText: {
    position: 'absolute',
    left: 16,
    right: 56,
    bottom: 16,
  },
  routeTag: {
    color: '#FFD6A5',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  routeName: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '900',
    marginTop: 4,
  },
  routeMeta: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
    opacity: 0.9,
  },
  favorite: {
    position: 'absolute',
    right: 14,
    top: 14,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteText: {
    color: '#FF7A59',
    fontSize: 22,
    marginTop: -2,
  },
  place: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 10,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0E4DC',
    flexDirection: 'row',
    shadowColor: '#1E1927',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  placeImage: {
    width: 90,
    height: 90,
    borderRadius: 14,
  },
  placeInfo: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  municipality: {
    color: '#FF7A59',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  placeName: {
    color: '#1E1927',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 3,
  },
  placeDescription: {
    color: '#806F69',
    fontSize: 12,
    marginTop: 3,
    lineHeight: 16,
  },
  distance: {
    color: '#00AEB7',
    fontSize: 11,
    fontWeight: '800',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    color: '#806F69',
    fontSize: 11,
    fontWeight: '800',
  },
  skeletonBox: {
    backgroundColor: '#F3ECE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingWrap: {
    paddingVertical: 36,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loadingText: {
    color: '#806F69',
    fontSize: 13,
    fontWeight: '700',
  },
});
