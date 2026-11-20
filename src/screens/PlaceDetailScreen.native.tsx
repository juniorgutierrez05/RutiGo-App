import React, { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store';
import { Button } from '../components/Button.native';
import { RatingStars } from '../components/RatingStars.native';
import { calculateDistanceKm, formatDistance, openExternalNavigation } from '../services/locationService';
import { fetchPlaceWeather, WeatherInfo } from '../services/weatherService';

export function PlaceDetailScreen() {
  const { selectedPlace, userLocation, navigateTo, goBack, isFavorite, toggleFavorite } = useApp();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const carouselWidth = width - 32;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);

  useEffect(() => {
    if (selectedPlace?.location) {
      setActiveImageIndex(0);
      fetchPlaceWeather(selectedPlace.location.lat, selectedPlace.location.lng).then(setWeather);
    }
  }, [selectedPlace]);

  if (!selectedPlace) {
    return (
      <View style={[styles.empty, { paddingTop: Math.max(insets.top, 20) + 20 }]}>
        <Text style={styles.title}>Lugar no encontrado</Text>
      </View>
    );
  }

  const openInAppMap = () => {
    navigateTo('interactive_map', { placeId: selectedPlace.id });
  };

  const images =
    selectedPlace.images && selectedPlace.images.length > 0
      ? selectedPlace.images
      : ['https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=1200&q=80'];

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: Math.max(insets.top, 20) + 10,
          paddingBottom: Math.max(insets.bottom, 16) + 32,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Pressable onPress={goBack} hitSlop={8} style={styles.backButton}>
        <Ionicons name="chevron-back" size={20} color="#FF7A59" />
        <Text style={styles.back}>Volver</Text>
      </Pressable>

      {/* Carrusel Deslizable de Fotos */}
      <View style={[styles.carouselContainer, { width: carouselWidth }]}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const offset = e.nativeEvent.contentOffset.x;
            const index = Math.round(offset / carouselWidth);
            setActiveImageIndex(index);
          }}
          style={{ width: carouselWidth, height: 230 }}
        >
          {images.map((imgUrl, idx) => (
            <Image
              key={`${imgUrl}-${idx}`}
              source={imgUrl}
              style={[styles.cover, { width: carouselWidth }]}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
          ))}
        </ScrollView>

        {images.length > 1 && (
          <View style={styles.dotsContainer}>
            {images.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === activeImageIndex && styles.activeDot]}
              />
            ))}
          </View>
        )}

        {images.length > 1 && (
          <View style={styles.counterBadge}>
            <Text style={styles.counterText}>{activeImageIndex + 1}/{images.length}</Text>
          </View>
        )}
      </View>

      <Text style={styles.category}>{selectedPlace.municipality.toUpperCase()}</Text>
      <Text style={styles.title}>{selectedPlace.name}</Text>

      <View style={styles.rating}>
        <RatingStars rating={selectedPlace.avgRating} showBadge reviewCount={selectedPlace.reviewCount} />
        <Text style={styles.distance}>{formatDistance(calculateDistanceKm(userLocation, selectedPlace.location))}</Text>
      </View>

      {/* Widget de Clima en Tiempo Real (Open-Meteo) */}
      {weather && (
        <View style={styles.weatherCard}>
          <Ionicons name={weather.iconName} size={24} color="#0284C7" />
          <View style={styles.weatherInfo}>
            <Text style={styles.weatherTemp}>{weather.temperature}°C · {weather.description}</Text>
            <Text style={styles.weatherWind}>Viento: {weather.windspeed} km/h en {selectedPlace.municipality}</Text>
          </View>
          <View style={styles.liveBadge}>
            <Text style={styles.liveText}>EN VIVO</Text>
          </View>
        </View>
      )}

      <Text style={styles.subtitle}>{selectedPlace.description}</Text>

      <View style={styles.info}>
        <Text style={styles.infoTitle}>Información práctica</Text>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={16} color="#FF7A59" />
          <Text style={styles.infoText}>{selectedPlace.address || 'Dirección disponible en el mapa'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={16} color="#FF7A59" />
          <Text style={styles.infoText}>{selectedPlace.schedule || 'Consulta el horario antes de visitar'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="hourglass-outline" size={16} color="#FF7A59" />
          <Text style={styles.infoText}>{selectedPlace.estimatedTime || 'Tiempo estimado por confirmar'}</Text>
        </View>
      </View>

      {/* Botones de Acción: GPS externo y RutiGo Map */}
      <View style={styles.actions}>
        <Button
          fullWidth
          onPress={() =>
            openExternalNavigation(
              selectedPlace.location.lat,
              selectedPlace.location.lng,
              selectedPlace.name
            )
          }
        >
          Cómo llegar (GPS Waze / Google)
        </Button>

        <Button fullWidth variant="outline" onPress={openInAppMap}>
          Ver en mapa de RutiGo
        </Button>

        <Button
          fullWidth
          variant="outline"
          onPress={() => toggleFavorite('place', selectedPlace.id)}
        >
          {isFavorite('place', selectedPlace.id) ? 'Quitar de guardados' : 'Guardar lugar'}
        </Button>

        <Button fullWidth variant="ghost" onPress={() => navigateTo('reviews')}>
          Ver reseñas ({selectedPlace.reviewCount})
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFCF8' },
  content: { paddingHorizontal: 16 },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  back: { color: '#FF7A59', fontSize: 16, fontWeight: '800' },
  carouselContainer: {
    height: 230,
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
    backgroundColor: '#F3EAE3',
  },
  cover: { height: 230, borderRadius: 22 },
  dotsContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  activeDot: {
    width: 20,
    backgroundColor: '#FF7A59',
  },
  counterBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  counterText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  category: { color: '#FF7A59', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  title: { color: '#1E1927', fontSize: 26, fontWeight: '900', marginTop: 4 },
  subtitle: { color: '#806F69', fontSize: 14, lineHeight: 21, marginTop: 10 },
  rating: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  distance: { color: '#00AEB7', fontSize: 13, fontWeight: '800' },
  weatherCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 14,
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  weatherInfo: { flex: 1 },
  weatherTemp: { color: '#0369A1', fontSize: 14, fontWeight: '800' },
  weatherWind: { color: '#0284C7', fontSize: 11, marginTop: 1 },
  liveBadge: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  info: { marginTop: 16, padding: 16, borderRadius: 18, backgroundColor: '#FFF0EB' },
  infoTitle: { color: '#1E1927', fontSize: 16, fontWeight: '900', marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  infoText: { color: '#58423C', fontSize: 13, flex: 1, lineHeight: 18 },
  actions: { gap: 10, marginTop: 20 },
  empty: { flex: 1, padding: 25, backgroundColor: '#FFFCF8' },
});
