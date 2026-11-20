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
  mapRef?: React.MutableRefObject<{ centerOn: (lat: number, lng: number, zoom?: number) => void } | null>;
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

  // Exponer método para centrar externamente (ej: botón "Mi ubicación")
  useEffect(() => {
    if (mapRef) {
      mapRef.current = {
        centerOn: (lat: number, lng: number, zoom = 14) => {
          webViewRef.current?.injectJavaScript(`
            if (window.map) {
              window.map.flyTo([${lat}, ${lng}], ${zoom}, { duration: 0.6 });
            }
            true;
          `);
        },
      };
    }
  }, [mapRef]);

  // Actualizar instantáneamente el marcador activo vía JS (SIN recargar el HTML)
  useEffect(() => {
    if (activePlace && isMapLoadedRef.current && webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        if (window.updateActivePlace) {
          window.updateActivePlace('${activePlace.id}', ${activePlace.location.lat}, ${activePlace.location.lng});
        }
        true;
      `);
    }
  }, [activePlace]);

  // Actualizar la ruta trazada instantáneamente vía JS
  useEffect(() => {
    if (isMapLoadedRef.current && webViewRef.current) {
      const coordsJson = JSON.stringify(
        showRoute ? routeCoords.map((c) => [c.latitude, c.longitude]) : []
      );
      webViewRef.current.injectJavaScript(`
        if (window.updateRoute) {
          window.updateRoute(${coordsJson});
        }
        true;
      `);
    }
  }, [showRoute, routeCoords]);

  // Generamos el HTML una sola vez para que el WebView NO se destruya ni recargue al cambiar de lugar
  const initialCenterLat = activePlace?.location.lat || userLocation?.lat || 10.9685;
  const initialCenterLng = activePlace?.location.lng || userLocation?.lng || -74.7813;
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
      background: #00AEB7;
      border: 3px solid #FFFFFF;
      box-shadow: 0 3px 8px rgba(0,0,0,0.22);
      color: #FFFFFF;
      font-weight: 900;
      font-size: 14px;
      transition: transform 0.25s ease, background 0.25s ease;
    }
    .custom-pin.active {
      background: #FF7A59;
      transform: scale(1.3);
      border-color: #FFFFFF;
      box-shadow: 0 5px 15px rgba(255,122,89,0.5);
      z-index: 9999 !important;
    }
    .user-pin {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #2563EB;
      border: 3px solid #FFFFFF;
      box-shadow: 0 0 0 6px rgba(37,99,235,0.25);
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
    }).setView([${initialCenterLat}, ${initialCenterLng}], 12);
    window.map = map;

    // Servidor de teselas global con CDN Fastly ultrarrápido y subdominios distribuidos
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c']
    }).addTo(map);

    // Marcador de ubicación del usuario
    if (userLoc && userLoc.lat) {
      const userIcon = L.divIcon({
        className: 'user-pin-wrap',
        html: '<div class="user-pin"></div>',
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });
      L.marker([userLoc.lat, userLoc.lng], { icon: userIcon }).addTo(map);
    }

    // Marcadores de atractivos turísticos
    places.forEach(p => {
      const isAct = p.id === activeId;
      const icon = L.divIcon({
        className: 'custom-pin-wrap',
        html: '<div class="custom-pin ' + (isAct ? 'active' : '') + '" id="pin-' + p.id + '">📍</div>',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const m = L.marker([p.location.lat, p.location.lng], { icon }).addTo(map);
      m.on('click', () => {
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'SELECT_PLACE',
          placeId: p.id
        }));
      });
      markersMap[p.id] = m;
    });

    window.updateActivePlace = function(id, lat, lng) {
      if (activeId && document.getElementById('pin-' + activeId)) {
        document.getElementById('pin-' + activeId).classList.remove('active');
      }
      activeId = id;
      if (document.getElementById('pin-' + id)) {
        document.getElementById('pin-' + id).classList.add('active');
      }
      map.flyTo([lat, lng], 13, { duration: 0.5 });
    };

    window.updateRoute = function(coords) {
      if (routePolyline) {
        map.removeLayer(routePolyline);
        routePolyline = null;
      }
      if (coords && coords.length > 0) {
        routePolyline = L.polyline(coords, {
          color: '#FF7A59',
          weight: 5,
          opacity: 0.9,
          lineJoin: 'round'
        }).addTo(map);
        map.fitBounds(routePolyline.getBounds(), { padding: [40, 40] });
      }
    };

    window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'MAP_READY' }));
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
        onMessage={(event: WebViewMessageEvent) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'SELECT_PLACE') {
              const found = places.find((p) => p.id === data.placeId);
              if (found) onSelectPlace(found);
            } else if (data.type === 'MAP_READY') {
              isMapLoadedRef.current = true;
              logEvent('info', 'LEAFLET', 'Motor de mapa Leaflet inicializado y teselas listas');
              onReady?.();
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
