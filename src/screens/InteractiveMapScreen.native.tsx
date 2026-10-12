import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LeafletMapView } from '../components/LeafletMapView.native';
import { getCurrentCoordinates } from '../services/locationService';
import { logEvent } from '../services/logger';
import { useApp } from '../store';
import { Place } from '../types';

type RouteResult = {
  coords: { latitude: number; longitude: number }[];
  distanceKm: number;
  durationMin: number;
};

export function InteractiveMapScreen() {
  const { places, selectedPlace, userLocation, navigateTo, goBack, refreshLocation } = useApp();
  const insets = useSafeAreaInsets();
  const [active, setActive] = useState<Place | null>(selectedPlace || places[0] || null);
  const [showRoute, setShowRoute] = useState(false);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [routeCoords, setRouteCoords] = useState<{latitude: number, longitude: number}[]>([]);
  const [routeInfo, setRouteInfo] = useState<{ distanceKm: number; durationMin: number } | null>(null);
  const mapRef = useRef<{ centerOn: (lat: number, lng: number, zoom?: number) => void } | null>(null);

  useEffect(() => {
    logEvent('info', 'MAP', `Pantalla de mapa abierta con ${places.length} lugares cargados`, {
      userLocation,
      initialActivePlace: active?.name,
    });
    refreshLocation();
  }, []);

  useEffect(() => {
    setShowRoute(false);
    setRouteCoords([]);
    setRouteInfo(null);
    if (active && mapRef.current) {
      mapRef.current.centerOn(active.location.lat, active.location.lng, 13);
    }
  }, [active]);

  const fetchStreetRoute = async (
    start: { lat: number; lng: number },
    dest: { lat: number; lng: number }
  ): Promise<RouteResult | null> => {
    // Solicitamos alternativas y seleccionamos la ruta físicamente más corta y directa
    const endpoints = [
      `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${dest.lng},${dest.lat}?overview=full&geometries=geojson&alternatives=3&continue_straight=true`,
      `https://routing.openstreetmap.de/routed-car/route/v1/driving/${start.lng},${start.lat};${dest.lng},${dest.lat}?overview=full&geometries=geojson&alternatives=3`,
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
        if (data.code === 'Ok' && Array.isArray(data.routes) && data.routes.length > 0) {
          // Ordenamos estrictamente por MENOR distancia en kilómetros para evitar desvíos largos
          const sortedRoutes = [...data.routes].sort((a, b) => a.distance - b.distance);
          const shortest = sortedRoutes[0];

          if (Array.isArray(shortest.geometry?.coordinates) && shortest.geometry.coordinates.length > 1) {
            return {
              coords: shortest.geometry.coordinates.map((c: [number, number]) => ({
                latitude: c[1],
                longitude: c[0],
              })),
              distanceKm: shortest.distance / 1000,
              durationMin: Math.max(1, Math.round(shortest.duration / 60)),
            };
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

    // Intentamos refrescar GPS en tiempo real para trazar desde la posición física exacta
    let origin = userLocation;
    try {
      const fresh = await getCurrentCoordinates();
      if (fresh && fresh.lat) {
        origin = fresh;
      }
    } catch {
      // Fallback a userLocation del store
    }

    logEvent('info', 'ROUTE', `Calculando ruta más directa hacia ${active.name}`, {
      origen: origin,
      destino: active.location,
    });

    try {
      const result = await fetchStreetRoute(origin, active.location);
      if (result && result.coords.length > 1) {
        setRouteCoords(result.coords);
        setRouteInfo({ distanceKm: result.distanceKm, durationMin: result.durationMin });
        logEvent('info', 'ROUTE', `Ruta calculada con éxito: ${result.distanceKm.toFixed(1)} km · ${result.durationMin} min`);
      } else {
        logEvent('warn', 'ROUTE', `No se pudo obtener ruta OSRM hacia ${active.name}`);
        Alert.alert(
          'Aviso de ruta',
          'No se pudo conectar al servidor de navegación para trazar las calles. Puedes iniciar la navegación directa en Google Maps.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Abrir Google Maps', onPress: openExternalGoogleMaps },
          ]
        );
      }
    } catch (err) {
      logEvent('error', 'ROUTE', `Error al calcular ruta hacia ${active.name}`, err instanceof Error ? err.message : String(err));
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
    logEvent('info', 'MAP', `Abriendo navegación externa en Google Maps para ${active.name}`);
    Linking.openURL(url).catch(() => {
      logEvent('error', 'MAP', 'Fallo al abrir Google Maps externo');
      Alert.alert('Error', 'No se pudo abrir Google Maps en el dispositivo.');
    });
  };

  const centerOnUser = () => {
    if (mapRef.current && userLocation) {
      logEvent('info', 'MAP', `Centrando mapa en la ubicación del usuario: ${userLocation.lat}, ${userLocation.lng}`);
      mapRef.current.centerOn(userLocation.lat, userLocation.lng, 14);
    }
  };

  return (
    <View style={styles.root}>
      {/* Mapa interactivo universal con soporte 100% garantizado en iOS y Android sin API Key */}
      <LeafletMapView
        places={places}
        activePlace={active}
        userLocation={userLocation}
        routeCoords={routeCoords}
        showRoute={showRoute}
        onSelectPlace={(place) => {
          logEvent('info', 'MAP', `Lugar seleccionado en mapa: ${place.name} (${place.municipality})`);
          setActive(place);
        }}
        mapRef={mapRef}
      />

      <View style={[styles.header, { top: Math.max(insets.top, 20) + 8 }]}>
        <Pressable onPress={goBack} hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color="#FF7A59" />
        </Pressable>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.title}>Mapa turístico</Text>
          <Text style={styles.subtitle}>{places.length} puntos · Atlántico</Text>
        </View>
      </View>

      <Pressable
        style={[styles.myLocationFab, { top: Math.max(insets.top, 20) + 74 }]}
        onPress={centerOnUser}
        hitSlop={8}
      >
        <Ionicons name="locate" size={22} color="#1E1927" />
      </Pressable>

      {active && (
        <View style={[styles.card, { bottom: Math.max(insets.bottom, 12) + 12 }]}>
          <Text style={styles.municipality}>{active.municipality}</Text>
          <Text style={styles.name}>{active.name}</Text>
          <Text style={styles.description} numberOfLines={1}>{active.description}</Text>
          
          {routeInfo && (
            <View style={styles.routeBadge}>
              <Ionicons name="navigate-circle" size={16} color="#FF7A59" />
              <Text style={styles.routeBadgeText}>
                Ruta directa: {routeInfo.distanceKm.toFixed(1)} km · ~{routeInfo.durationMin} min
              </Text>
            </View>
          )}

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
              <View style={styles.mapsBtnRow}>
                <Text style={styles.mapsButtonText}>Google Maps</Text>
                <Ionicons name="open-outline" size={14} color="#00AEB7" />
              </View>
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
  myLocationFab: {
    position: 'absolute',
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFFFA',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1E1927',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F0E4DC',
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
  mapsBtnRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  routeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF0EB',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  routeBadgeText: {
    color: '#7C2106',
    fontSize: 12,
    fontWeight: '800',
  },
  map: { width: '100%', height: '100%' },
});
