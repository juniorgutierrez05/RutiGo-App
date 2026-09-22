import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useApp } from '../store';
import { Place } from '../types';

export function InteractiveMapScreen() {
  const { places, selectedPlace, userLocation, navigateTo, refreshLocation } = useApp();
  const [active, setActive] = useState<Place | null>(selectedPlace || places[0] || null);
  const [showRoute, setShowRoute] = useState(false);
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => { refreshLocation(); }, [refreshLocation]);

  useEffect(() => {
    if (active && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: active.location.lat,
        longitude: active.location.lng,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      }, 500);
    }
  }, [active]);

  const directions = () => {
    if (!active) return;
    setShowRoute(true);
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: (userLocation.lat + active.location.lat) / 2,
        longitude: (userLocation.lng + active.location.lng) / 2,
        latitudeDelta: Math.abs(userLocation.lat - active.location.lat) * 1.8 + 0.08,
        longitudeDelta: Math.abs(userLocation.lng - active.location.lng) * 1.8 + 0.08,
      }, 500);
    }
  };

  return (
    <View style={styles.root}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        initialRegion={{ latitude: userLocation.lat, longitude: userLocation.lng, latitudeDelta: 0.35, longitudeDelta: 0.35 }}
        showsUserLocation
        showsMyLocationButton
      >
        <Marker coordinate={{ latitude: userLocation.lat, longitude: userLocation.lng }} title="Tu ubicación" pinColor="#00AEB7" />
        {places.map((place) => (
          <Marker
            key={place.id}
            coordinate={{ latitude: place.location.lat, longitude: place.location.lng }}
            title={place.name}
            description={place.municipality}
            pinColor={active?.id === place.id ? '#FF7A59' : '#00AEB7'}
            onPress={() => setActive(place)}
          />
        ))}
        {showRoute && active && (
          <Polyline
            coordinates={[
              { latitude: userLocation.lat, longitude: userLocation.lng },
              { latitude: active.location.lat, longitude: active.location.lng },
            ]}
            strokeColor="#FF7A59"
            strokeWidth={4}
          />
        )}
      </MapView>

      <View style={styles.header}>
        <Pressable onPress={() => navigateTo('home')}><Text style={styles.back}>‹</Text></Pressable>
        <View>
          <Text style={styles.title}>Mapa turístico</Text>
          <Text style={styles.subtitle}>{places.length} puntos · Atlántico</Text>
        </View>
      </View>

      {active && (
        <View style={styles.card}>
          <Text style={styles.municipality}>{active.municipality}</Text>
          <Text style={styles.name}>{active.name}</Text>
          <Text style={styles.description} numberOfLines={1}>{active.description}</Text>
          <Pressable style={styles.button} onPress={directions}>
            <Text style={styles.buttonText}>{showRoute ? 'Ruta en RutiGo' : 'Iniciar recorrido'}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { position: 'absolute', top: 18, left: 16, right: 16, backgroundColor: '#FFFFFFEE', borderRadius: 18, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 10 },
  back: { color: '#FF7A59', fontSize: 34 },
  title: { color: '#1E1927', fontSize: 17, fontWeight: '900' },
  subtitle: { color: '#806F69', fontSize: 11, marginTop: 2 },
  card: { position: 'absolute', bottom: 22, left: 16, right: 16, backgroundColor: '#FFFFFFF5', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: '#F0E4DC' },
  municipality: { color: '#FF7A59', fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  name: { color: '#1E1927', fontSize: 18, fontWeight: '900', marginTop: 3 },
  description: { color: '#806F69', fontSize: 12, marginTop: 4 },
  button: { backgroundColor: '#FF7A59', borderRadius: 14, paddingVertical: 13, alignItems: 'center', marginTop: 12 },
  buttonText: { color: '#FFFFFF', fontWeight: '900' },
});
