import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store';
import { BottomNav } from '../components/BottomNav.native';
import { Card } from '../components/Card.native';
import { Chip } from '../components/Chip.native';
import { TopAppBar } from '../components/TopAppBar.native';
import { IMAGES } from '../assets/images';
import { calculateDistanceKm, formatDistance } from '../services/locationService';
import { CategoryType } from '../types';
import { theme } from '../theme/expressiveTheme';

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

  // Animación del botón flotante de Ruti:
  // Visible expandido durante los primeros 5 segundos; luego se contrae suavemente en una bolita flotante circular.
  const fabAnim = useRef(new Animated.Value(1)).current; // 1 = expandido (pill), 0 = bolita circular
  const fabPressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fabAnim, {
        toValue: 0,
        duration: 750,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
        useNativeDriver: false, // se animan width, padding y opacidades
      }).start();
    }, 5000);

    return () => clearTimeout(timer);
  }, [fabAnim]);

  const handlePressFab = () => {
    Animated.sequence([
      Animated.timing(fabPressScale, {
        toValue: 0.88,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.timing(fabPressScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigateTo('chat');
    });
  };

  const fabWidth = fabAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [56, 212],
  });

  const textWidth = fabAnim.interpolate({
    inputRange: [0, 0.35, 1],
    outputRange: [0, 0, 116],
  });

  const textOpacity = fabAnim.interpolate({
    inputRange: [0, 0.45, 1],
    outputRange: [0, 0, 1],
  });

  const sparkleOpacity = fabAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const miniBadgeOpacity = fabAnim.interpolate({
    inputRange: [0, 0.35, 1],
    outputRange: [1, 0, 0],
  });

  return (
    <View style={styles.root}>
      <TopAppBar title="Barranquilla & Atlántico" subtitle="Guía costera activa" showNotifications />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 12) + 84 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#E60124']}
            tintColor="#E60124"
          />
        }
      >
        <Pressable style={styles.search} onPress={() => navigateTo('search')}>
          <View style={styles.searchLeading}>
            <Ionicons name="search" size={20} color="#E60124" />
            <Text style={styles.searchText}>Buscar rutas, gastronomía, lugares...</Text>
          </View>
          <View style={styles.searchTrailing}>
            <Ionicons name="options-outline" size={18} color="#806F69" />
          </View>
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
          <Chip label="Cultura" icon="🏛️" category="cultura" selected={activeCategory === 'cultura'} onClick={() => select('cultura')} />
          <Chip label="Gastronomía" icon="🍲" category="gastronomia" selected={activeCategory === 'gastronomia'} onClick={() => select('gastronomia')} />
          <Chip label="Naturaleza" icon="🌿" category="naturaleza" selected={activeCategory === 'naturaleza'} onClick={() => select('naturaleza')} />
          <Chip label="Historia" icon="📜" category="historia" selected={activeCategory === 'historia'} onClick={() => select('historia')} />
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
                    <View style={styles.badgeContainer}>
                      <Text style={styles.routeTag}>★ IMPERDIBLE</Text>
                    </View>
                    <Text style={styles.routeName} numberOfLines={2}>{featuredRoute.name}</Text>
                    <View style={styles.featuredPillsRow}>
                      <View style={styles.heroPill}>
                        <Ionicons name="time-outline" size={13} color="#FFFFFF" />
                        <Text style={styles.heroPillText}>{featuredRoute.durationEstimate}</Text>
                      </View>
                      <View style={styles.heroPill}>
                        <Ionicons name="navigate-outline" size={13} color="#FFFFFF" />
                        <Text style={styles.heroPillText}>{featuredRoute.distanceKm} km</Text>
                      </View>
                    </View>
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
              <ActivityIndicator color="#E60124" size="large" />
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
            <ActivityIndicator color="#E60124" size="small" />
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
                <View style={styles.placeHeaderRow}>
                  <View style={styles.muniBadge}>
                    <Text style={styles.municipality}>{place.municipality.toUpperCase()}</Text>
                  </View>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={11} color="#D97706" />
                    <Text style={styles.ratingText}>{place.avgRating.toFixed(1)}</Text>
                  </View>
                </View>
                <Text style={styles.placeName} numberOfLines={1}>{place.name}</Text>
                <Text style={styles.placeDescription} numberOfLines={2}>{place.description}</Text>
                <View style={styles.metaRow}>
                  <View style={styles.distanceBadge}>
                    <Ionicons name="location-outline" size={12} color="#006E73" />
                    <Text style={styles.distance}>
                      {formatDistance(calculateDistanceKm(userLocation, place.location))}
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>

      {/* Botón flotante animado de Ruti (pastilla 5 seg -> bolita flotante circular) */}
      <Animated.View
        style={[
          styles.chatFab,
          {
            bottom: Math.max(insets.bottom, 12) + 80,
            width: fabWidth,
            transform: [{ scale: fabPressScale }],
          },
        ]}
      >
        <Pressable
          style={styles.chatFabPressable}
          onPress={handlePressFab}
          hitSlop={6}
          accessibilityLabel="Pregúntale a Ruti"
        >
          <View style={styles.chatFabIconWrap}>
            <Image
              source={IMAGES.brand.officialIcon}
              style={styles.chatFabIcon}
              contentFit="cover"
            />
            {/* Pequeña insignia dorada cuando queda como bolita */}
            <Animated.View
              style={[styles.miniSparkleBadge, { opacity: miniBadgeOpacity }]}
              pointerEvents="none"
            >
              <Ionicons name="sparkles" size={8} color="#FFD200" />
            </Animated.View>
          </View>

          <Animated.View
            style={[
              styles.chatFabTextContainer,
              {
                width: textWidth,
                opacity: textOpacity,
              },
            ]}
          >
            <Text style={styles.chatFabTitle} numberOfLines={1}>
              Pregúntale a Ruti
            </Text>
            <Text style={styles.chatFabSub} numberOfLines={1}>
              Guía IA del Atlántico
            </Text>
          </Animated.View>

          <Animated.View style={{ opacity: sparkleOpacity }}>
            <Ionicons name="sparkles" size={16} color="#FFD200" />
          </Animated.View>
        </Pressable>
      </Animated.View>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingTop: 10,
  },
  search: {
    marginHorizontal: 16,
    marginTop: 10,
    height: 56,
    paddingHorizontal: 16,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECECEC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  searchLeading: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  searchTrailing: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
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
    color: '#E60124',
    fontSize: 13,
    fontWeight: '800',
  },
  chips: {
    gap: 10,
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
    borderRadius: theme.shapes.card,
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
  badgeContainer: {
    backgroundColor: '#FDE8EA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  routeTag: {
    color: '#E60124',
    fontSize: 10.5,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  routeName: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '900',
    marginTop: 2,
  },
  featuredPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.48)',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 10,
  },
  heroPillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
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
  place: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: theme.shapes.card,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECECEC',
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.elevation.card,
  },
  placeImage: {
    width: 96,
    height: 96,
    borderRadius: theme.isAndroid ? 22 : 16,
  },
  placeInfo: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: 'center',
  },
  placeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  muniBadge: {
    backgroundColor: '#FDE8EA',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 8,
  },
  municipality: {
    color: '#E60124',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 8,
  },
  ratingText: {
    color: '#92400E',
    fontSize: 11,
    fontWeight: '900',
  },
  placeName: {
    color: '#1E1927',
    fontSize: 15.5,
    fontWeight: '900',
    marginTop: 2,
  },
  placeDescription: {
    color: '#806F69',
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: theme.isAndroid ? '#D2F7F9' : '#E5FAF8',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 8,
  },
  distance: {
    color: '#006E73',
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
  chatFab: {
    position: 'absolute',
    right: 16,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E60124',
    shadowColor: '#E60124',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 90,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatFabPressable: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    gap: 8,
  },
  chatFabIconWrap: {
    position: 'relative',
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatFabIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  miniSparkleBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#E60124',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatFabTextContainer: {
    justifyContent: 'center',
    overflow: 'hidden',
  },
  chatFabTitle: {
    color: '#E60124',
    fontSize: 12.5,
    fontWeight: '900',
  },
  chatFabSub: {
    color: '#6B7280',
    fontSize: 10,
    fontWeight: '700',
  },
});
