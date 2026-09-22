import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../store';
import { Button } from '../components/Button.native';
import { RatingStars } from '../components/RatingStars.native';
import { calculateDistanceKm, formatDistance } from '../services/locationService';

export function PlaceDetailScreen() {
  const { selectedPlace, userLocation, navigateTo, goBack, isFavorite, toggleFavorite } = useApp();

  if (!selectedPlace) {
    return <View style={styles.empty}><Text style={styles.title}>Lugar no encontrado</Text></View>;
  }

  const openInAppMap = () => {
    navigateTo('interactive_map', { placeId: selectedPlace.id });
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Pressable onPress={goBack}><Text style={styles.back}>‹ Volver</Text></Pressable>
      <Image source={{ uri: selectedPlace.images[0] }} style={styles.cover} />
      <Text style={styles.category}>{selectedPlace.municipality.toUpperCase()}</Text>
      <Text style={styles.title}>{selectedPlace.name}</Text>
      <View style={styles.rating}>
        <RatingStars rating={selectedPlace.avgRating} showBadge reviewCount={selectedPlace.reviewCount} />
        <Text style={styles.distance}>{formatDistance(calculateDistanceKm(userLocation, selectedPlace.location))}</Text>
      </View>
      <Text style={styles.subtitle}>{selectedPlace.description}</Text>
      <View style={styles.info}>
        <Text style={styles.infoTitle}>Información práctica</Text>
        <Text style={styles.infoText}>⌖ {selectedPlace.address || 'Dirección disponible en el mapa'}</Text>
        <Text style={styles.infoText}>◷ {selectedPlace.schedule || 'Consulta el horario antes de visitar'}</Text>
        <Text style={styles.infoText}>◉ {selectedPlace.estimatedTime || 'Tiempo estimado por confirmar'}</Text>
      </View>
      <Button fullWidth onPress={openInAppMap}>Ver en el mapa</Button>
      <Button fullWidth variant="outline" onPress={() => toggleFavorite('place', selectedPlace.id)}>{isFavorite('place', selectedPlace.id) ? 'Quitar de guardados' : 'Guardar lugar'}</Button>
      <Button fullWidth variant="ghost" onPress={() => navigateTo('reviews')}>Ver reseñas</Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFCF8' },
  content: { padding: 18, paddingBottom: 35 },
  back: { color: '#FF7A59', fontSize: 15, fontWeight: '800', marginBottom: 14 },
  cover: { width: '100%', height: 230, borderRadius: 24, marginBottom: 18 },
  category: { color: '#FF7A59', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  title: { color: '#1E1927', fontSize: 29, fontWeight: '900', marginTop: 6 },
  subtitle: { color: '#806F69', fontSize: 14, lineHeight: 21, marginTop: 9 },
  rating: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  distance: { color: '#00AEB7', fontSize: 13, fontWeight: '800' },
  info: { marginTop: 22, padding: 16, borderRadius: 18, backgroundColor: '#FFF0EB' },
  infoTitle: { color: '#1E1927', fontSize: 17, fontWeight: '900', marginBottom: 8 },
  infoText: { color: '#58423C', fontSize: 13, marginTop: 7 },
  empty: { flex: 1, padding: 25 },
});
