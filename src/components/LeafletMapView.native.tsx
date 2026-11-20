import React, { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { logEvent } from '../services/logger';
import { Place, PlaceLocation } from '../types';

const MapWebView = WebView as any;

type LeafletMapViewProps = {
  places: Place[];
  activePlace: Place | null;
  userLocation: PlaceLocation;
  routeCoords?: { latitude: number; longitude: number }[];
  showRoute?: boolean;
  onSelectPlace: (place: Place) => void;
  onReady?: () => void;
  mapRef?: React.MutableRefObject<{
    centerOn: (lat: number, lng: number, zoom?: number) => void;
    fitPlaces: (placesList: Place[]) => void;
  } | null>;
};

export function LeafletMapView({
  places,
  activePlace,
  userLocation,
  routeCoords = [],
  showRoute = false,
  onSelectPlace,
  onReady,
  mapRef,
}: LeafletMapViewProps) {
  const webViewRef = useRef<WebView | null>(null);
  const isMapLoadedRef = useRef(false);
  const latestRouteCoordsRef = useRef<{ latitude: number; longitude: number }[]>(routeCoords);
  const latestShowRouteRef = useRef<boolean>(showRoute);
  const latestActivePlaceRef = useRef<Place | null>(activePlace);

  // Mantener referencias actualizadas siempre
  latestRouteCoordsRef.current = routeCoords;
  latestShowRouteRef.current = showRoute;
  latestActivePlaceRef.current = activePlace;

  // Funciones de inyección seguras y resilientes
  const sendRouteToMap = (coords: { latitude: number; longitude: number }[], show: boolean) => {
    if (!webViewRef.current) return;
    const coordsJson = JSON.stringify(
      show && coords.length > 0 ? coords.map((c) => [c.latitude, c.longitude]) : []
    );
    webViewRef.current.injectJavaScript(`
      if (typeof window.updateRoute === 'function') {
        window.updateRoute(${coordsJson});
      }
      true;
    `);
  };

  const sendActivePlaceToMap = (place: Place | null) => {
    if (!webViewRef.current || !place) return;
    webViewRef.current.injectJavaScript(`
      if (typeof window.updateActivePlace === 'function') {
        window.updateActivePlace('${place.id}', ${place.location.lat}, ${place.location.lng});
      }
      true;
    `);
  };

  // Exponer método para centrar y encuadrar externamente (ej: botón "Mi ubicación", filtros)
  useEffect(() => {
    if (mapRef) {
      mapRef.current = {
        centerOn: (lat: number, lng: number, zoom = 14) => {
          webViewRef.current?.injectJavaScript(`
            if (window.map) {
              window.map.stop();
              window.map.flyTo([${lat}, ${lng}], ${zoom}, { duration: 0.5 });
            }
            true;
          `);
        },
        fitPlaces: (placesList: Place[]) => {
          if (!placesList || placesList.length === 0) return;
          const coords = JSON.stringify(
            placesList.map((p) => ({ lat: p.location.lat, lng: p.location.lng }))
          );
          webViewRef.current?.injectJavaScript(`
            if (typeof window.fitPlaces === 'function') {
              window.fitPlaces(${coords});
            }
            true;
          `);
        },
      };
    }
  }, [mapRef]);

  // Actualizar marcadores en vivo sin recargar el mapa (0ms latencia)
  useEffect(() => {
    if (webViewRef.current && isMapLoadedRef.current) {
      const placesJson = JSON.stringify(places);
      webViewRef.current.injectJavaScript(`
        if (typeof window.setPlaces === 'function') {
          window.setPlaces(${placesJson});
        }
        true;
      `);
    }
  }, [places]);

  // Actualizar marcador activo vía JS
  useEffect(() => {
    sendActivePlaceToMap(activePlace);
  }, [activePlace]);

  // Actualizar la ruta trazada vía JS
  useEffect(() => {
    sendRouteToMap(routeCoords, showRoute);
  }, [showRoute, routeCoords]);

  // Actualizar la posición del usuario cuando el GPS del dispositivo responda
  useEffect(() => {
    if (userLocation?.lat && userLocation?.lng && webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        if (typeof window.updateUserLocation === 'function') {
          window.updateUserLocation(${userLocation.lat}, ${userLocation.lng});
        }
        true;
      `);
    }
  }, [userLocation]);

  const handleMapReady = () => {
    isMapLoadedRef.current = true;
    logEvent('info', 'LEAFLET', 'Motor de mapa Leaflet inicializado y listo');
    // Sincronizar ubicación de usuario, marcador activo y ruta
    if (userLocation?.lat && userLocation?.lng) {
      webViewRef.current?.injectJavaScript(`
        if (typeof window.updateUserLocation === 'function') {
          window.updateUserLocation(${userLocation.lat}, ${userLocation.lng});
        }
        true;
      `);
    }
    sendActivePlaceToMap(latestActivePlaceRef.current);
    sendRouteToMap(latestRouteCoordsRef.current, latestShowRouteRef.current);
    onReady?.();
  };

  // Al abrir el mapa, siempre priorizar estrictamente la ubicación del dispositivo del usuario
  const initialCenterLat = userLocation?.lat || 10.9685;
  const initialCenterLng = userLocation?.lng || -74.7813;
  const initialActiveId = activePlace?.id || '';

  const htmlSource = useMemo(() => {
    const placesJson = JSON.stringify(places);
    const userLocJson = JSON.stringify(userLocation);

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <!-- CDN Cloudflare Ultrarrápido con Edge Nodes en Colombia -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; background: #E8ECEF; }
    .custom-pin {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #E60124;
      border: 3px solid #FFFFFF;
      box-shadow: 0 3px 8px rgba(230,1,36,0.35);
      color: #FFFFFF;
      font-weight: 900;
      font-size: 14px;
      transition: transform 0.25s ease, background 0.25s ease;
    }
    .custom-pin.active {
      background: #FFD200;
      color: #1E1927;
      transform: scale(1.3);
      border-color: #E60124;
      box-shadow: 0 5px 15px rgba(230,1,36,0.45);
      z-index: 9999 !important;
    }
    .user-pin {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #5DB872;
      border: 3px solid #FFFFFF;
      box-shadow: 0 0 0 6px rgba(93,184,114,0.35);
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    const places = ${placesJson};
    const userLoc = ${userLocJson};
    let activeId = '${initialActiveId}';
    let markersMap = {};
    let routePolyline = null;

    const map = L.map('map', {
      zoomControl: false,
      attributionControl: false,
      fadeAnimation: true,
      zoomAnimation: true
    }).setView([${initialCenterLat}, ${initialCenterLng}], 14);
    window.map = map;

    // Servidor de teselas global con CDN Fastly ultrarrápido y subdominios distribuidos
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c']
    }).addTo(map);

    // Marcador de ubicación del usuario
    let userMarker = null;
    if (userLoc && userLoc.lat) {
      const userIcon = L.divIcon({
        className: 'user-pin-wrap',
        html: '<div class="user-pin"></div>',
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });
      userMarker = L.marker([userLoc.lat, userLoc.lng], { icon: userIcon }).addTo(map);
    }

    window.updateUserLocation = function(lat, lng) {
      try {
        if (userMarker) {
          userMarker.setLatLng([lat, lng]);
        } else {
          const userIcon = L.divIcon({
            className: 'user-pin-wrap',
            html: '<div class="user-pin"></div>',
            iconSize: [18, 18],
            iconAnchor: [9, 9]
          });
          userMarker = L.marker([lat, lng], { icon: userIcon }).addTo(map);
        }
      } catch (e) {}
    };

    // Marcadores dinámicos agrupados
    let currentPlacesList = places;
    const markersGroup = L.layerGroup().addTo(map);

    function getPinMeta(p) {
      const tagLower = (p.tag || '').toLowerCase();
      const nameLower = (p.name || '').toLowerCase();
      if (
        tagLower.includes('centro comercial') ||
        tagLower.includes('mall') ||
        nameLower.includes('centro comercial') ||
        nameLower.includes('mallplaza') ||
        nameLower.includes('viva barranquilla') ||
        nameLower.includes('buenavista') ||
        nameLower.includes('carnaval') ||
        nameLower.includes('gran plaza')
      ) {
        return { emoji: '🛍️', bg: '#2563EB' }; // Centros comerciales (Azul)
      }
      if (
        p.category === 'gastronomia' ||
        nameLower.includes('restaurante') ||
        tagLower.includes('cocina') ||
        tagLower.includes('culinario') ||
        tagLower.includes('gastronomía') ||
        tagLower.includes('gastronomia')
      ) {
        return { emoji: '🍽️', bg: '#EA580C' }; // Restaurantes (Naranja)
      }
      return { emoji: '🏛️', bg: '#E60124' }; // Zonas turísticas & culturales (Rojo)
    }

    function renderMarkers(placesList) {
      currentPlacesList = placesList || [];
      markersGroup.clearLayers();
      markersMap = {};

      currentPlacesList.forEach(p => {
        const isAct = p.id === activeId;
        const meta = getPinMeta(p);
        const icon = L.divIcon({
          className: 'custom-pin-wrap',
          html: '<div class="custom-pin ' + (isAct ? 'active' : '') + '" id="pin-' + p.id + '" style="background:' + (isAct ? '#FFD200' : meta.bg) + '">' + meta.emoji + '</div>',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const m = L.marker([p.location.lat, p.location.lng], { icon });
        m.on('click', () => {
          window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'SELECT_PLACE',
            placeId: p.id
          }));
        });
        markersGroup.addLayer(m);
        markersMap[p.id] = m;
      });
    }

    renderMarkers(places);

    window.setPlaces = function(newPlacesList) {
      try {
        renderMarkers(newPlacesList);
      } catch (e) {}
    };

    window.fitPlaces = function(coordsList) {
      try {
        if (coordsList && coordsList.length > 0) {
          if (coordsList.length === 1) {
            map.stop();
            map.flyTo([coordsList[0].lat, coordsList[0].lng], 15, { duration: 0.6 });
          } else {
            const bounds = L.latLngBounds(coordsList.map(c => [c.lat, c.lng]));
            if (bounds.isValid()) {
              map.stop();
              map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15, duration: 0.6 });
            }
          }
        }
      } catch (e) {}
    };

    window.updateActivePlace = function(id, lat, lng) {
      try {
        if (activeId && document.getElementById('pin-' + activeId)) {
          const oldEl = document.getElementById('pin-' + activeId);
          oldEl.classList.remove('active');
          const oldPlace = currentPlacesList.find(p => p.id === activeId);
          if (oldPlace) {
            const meta = getPinMeta(oldPlace);
            oldEl.style.background = meta.bg;
          }
        }
        activeId = id;
        if (document.getElementById('pin-' + id)) {
          const newEl = document.getElementById('pin-' + id);
          newEl.classList.add('active');
          newEl.style.background = '#FFD200';
        }
        map.stop();
        map.flyTo([lat, lng], 14, { duration: 0.5 });
      } catch (e) {}
    };

    let routePolylineBg = null;
    window.updateRoute = function(coords) {
      try {
        if (routePolylineBg) {
          map.removeLayer(routePolylineBg);
          routePolylineBg = null;
        }
        if (routePolyline) {
          map.removeLayer(routePolyline);
          routePolyline = null;
        }
        if (coords && Array.isArray(coords) && coords.length > 1) {
          map.stop();

          // Capa de fondo blanca gruesa (8px) para máximo contraste y nitidez sobre cualquier calle
          routePolylineBg = L.polyline(coords, {
            color: '#FFFFFF',
            weight: 8,
            opacity: 0.95,
            lineJoin: 'round',
            lineCap: 'round'
          }).addTo(map);

          // Línea principal rojo RutiGo vibrante (5px)
          routePolyline = L.polyline(coords, {
            color: '#E60124',
            weight: 5,
            opacity: 0.98,
            lineJoin: 'round',
            lineCap: 'round'
          }).addTo(map);

          const bounds = routePolyline.getBounds();
          if (bounds && bounds.isValid()) {
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
          }
        }
      } catch (err) {
        console.warn('Error al actualizar ruta Leaflet:', err);
      }
    };

    // Notificación resiliente con reintento si window.ReactNativeWebView aún se está inyectando
    function notifyReady() {
      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'MAP_READY' }));
      } else {
        setTimeout(notifyReady, 60);
      }
    }
    notifyReady();
  </script>
</body>
</html>
    `;
    return { html };
  }, [places.length]);

  return (
    <View style={StyleSheet.absoluteFill}>
      <MapWebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={htmlSource}
        style={styles.webView}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        cacheEnabled
        androidHardwareAccelerationDisabled={false}
        onLoadEnd={handleMapReady}
        onMessage={(event: WebViewMessageEvent) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'SELECT_PLACE') {
              const found = places.find((p) => p.id === data.placeId);
              if (found) onSelectPlace(found);
            } else if (data.type === 'MAP_READY') {
              handleMapReady();
            }
          } catch (err) {
            logEvent('warn', 'LEAFLET', 'Error procesando mensaje de WebView Leaflet', err instanceof Error ? err.message : String(err));
          }
        }}
        onError={(err: any) => {
          logEvent('error', 'LEAFLET', 'Error cargando WebView de mapa Leaflet', err?.nativeEvent?.description || 'Error');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  webView: {
    flex: 1,
    backgroundColor: '#E8ECEF',
  },
});
