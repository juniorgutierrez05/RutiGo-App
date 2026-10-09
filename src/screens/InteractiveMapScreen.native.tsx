import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useApp } from '../store';
import { Place } from '../types';

export function InteractiveMapScreen() {
  const { places, selectedPlace, userLocation, navigateTo, refreshLocation } = useApp();
  const insets = useSafeAreaInsets();
  const [active, setActive] = useState<Place | null>(selectedPlace || places[0] || null);
  const [showRoute, setShowRoute] = useState(false);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [routeCoords, setRouteCoords] = useState<{latitude: number, longitude: number}[]>([]);
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    refreshLocation();
  }, []);

  useEffect(() => {
    setShowRoute(false);
    setRouteCoords([]);
    if (active && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: active.location.lat,
        longitude: active.location.lng,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      }, 500);
    }
  }, [active]);

  const fetchStreetRoute = async (
    start: { lat: number; lng: number },
    dest: { lat: number; lng: number }
  ): Promise<{ latitude: number; longitude: number }[] | null> => {
    const endpoints = [
      `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${dest.lng},${dest.lat}?overview=full&geometries=geojson`,
      `https://routing.openstreetmap.de/routed-car/route/v1/driving/${start.lng},${start.lat};${dest.lng},${dest.lat}?overview=full&geometries=geojson`,
    ];

    for (const url of endpoints) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7000);
        const res = await fetch(url, {
          signal: controller.signal,
          headers: { 'Accept': 'application/json' },
        });
        clearTimeout(timeoutId);

        if (!res.ok) continue;
        const data = await res.json();
        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
          const coords = data.routes[0].geometry.coordinates;
          if (Array.isArray(coords) && coords.length > 1) {
            return coords.map((c: [number, number]) => ({ latitude: c[1], longitude: c[0] }));
          }
        }
      } catch {
        // Continuar al siguiente endpoint si hay error de red o timeout
      }
    }
    return null;
  };

  const directions = async () => {
    if (!active) return;
    setLoadingRoute(true);
    setShowRoute(true);

    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: (userLocation.lat + active.location.lat) / 2,
        longitude: (userLocation.lng + active.location.lng) / 2,
        latitudeDelta: Math.abs(userLocation.lat - active.location.lat) * 1.8 + 0.08,
        longitudeDelta: Math.abs(userLocation.lng - active.location.lng) * 1.8 + 0.08,
      }, 500);
    }

    try {
      const coords = await fetchStreetRoute(userLocation, active.location);
      if (coords && coords.length > 1) {
        setRouteCoords(coords);
      } else {
        Alert.alert(
          'Aviso de ruta',
          'No se pudo conectar al servidor de navegación para trazar las calles. Puedes iniciar la navegación directa en Google Maps.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Abrir Google Maps', onPress: openExternalGoogleMaps },
          ]
        );
      }
    } catch {
      Alert.alert(
        'Error',
        'Ocurrió un problema obteniendo la ruta. Puedes usar Google Maps directamente.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Abrir Google Maps', onPress: openExternalGoogleMaps },
        ]
      );
    } finally {
      setLoadingRoute(false);
    }
  };

  const openExternalGoogleMaps = () => {
    if (!active) return;
    const { lat, lng } = active.location;
    const label = encodeURIComponent(active.name);
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${lat},${lng}&travelmode=driving`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'No se pudo abrir Google Maps en el dispositivo.');
    });
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
        {showRoute && active && routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor="#FF7A59"
            strokeWidth={5}
          />
        )}
      </MapView>

      <View style={[styles.header, { top: Math.max(insets.top, 20) + 8 }]}>
        <Pressable onPress={() => navigateTo('home')} hitSlop={8}><Text style={styles.back}>‹</Text></Pressable>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.title}>Mapa turístico</Text>
          <Text style={styles.subtitle}>{places.length} puntos · Atlántico</Text>
        </View>
      </View>

      {active && (
        <View style={[styles.card, { bottom: Math.max(insets.bottom, 12) + 12 }]}>
          <Text style={styles.municipality}>{active.municipality}</Text>
          <Text style={styles.name}>{active.name}</Text>
          <Text style={styles.description} numberOfLines={1}>{active.description}</Text>
          
          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.button, styles.primaryButton]}
              onPress={directions}
              disabled={loadingRoute}
            >
              {loadingRoute ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.buttonText}>
                  {showRoute && routeCoords.length > 0 ? 'Recalcular ruta' : 'Ver ruta por calles'}
                </Text>
              )}
            </Pressable>

            <Pressable
              style={[styles.button, styles.mapsButton]}
              onPress={openExternalGoogleMaps}
            >
              <Text style={styles.mapsButtonText}>Google Maps ↗</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFFFA',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#1E1927',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F0E4DC',
  },
  headerTitleWrap: {
    flex: 1,
  },
  back: { color: '#FF7A59', fontSize: 32, marginTop: -2 },
  title: { color: '#1E1927', fontSize: 17, fontWeight: '900' },
  subtitle: { color: '#806F69', fontSize: 11, marginTop: 1 },
  card: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFFFA',
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#F0E4DC',
    shadowColor: '#1E1927',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  municipality: { color: '#FF7A59', fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  name: { color: '#1E1927', fontSize: 18, fontWeight: '900', marginTop: 3 },
  description: { color: '#806F69', fontSize: 12, marginTop: 4 },
  buttonRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  button: { flex: 1, borderRadius: 14, paddingVertical: 13, alignItems: 'center', justifyContent: 'center' },
  primaryButton: { backgroundColor: '#FF7A59', flex: 1.3 },
  mapsButton: { backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#00AEB7' },
  buttonText: { color: '#FFFFFF', fontWeight: '900', fontSize: 13 },
  mapsButtonText: { color: '#00AEB7', fontWeight: '900', fontSize: 13 },
});
