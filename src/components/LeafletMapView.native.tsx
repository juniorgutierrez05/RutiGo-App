import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { logEvent } from '../services/logger';
import { Place, PlaceLocation } from '../types';

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

  // Exponer método para centrar externamente (ej: botón "Mi ubicación")
  useEffect(() => {
    if (mapRef) {
      mapRef.current = {
        centerOn: (lat: number, lng: number, zoom = 14) => {
          webViewRef.current?.injectJavaScript(`
            if (window.map) {
              window.map.flyTo([${lat}, ${lng}], ${zoom}, { duration: 0.8 });
            }
            true;
          `);
        },
      };
    }
  }, [mapRef]);

  // Actualizar la vista y el marcador activo cuando cambia activePlace
  useEffect(() => {
    if (activePlace && webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        if (window.updateActivePlace) {
          window.updateActivePlace('${activePlace.id}', ${activePlace.location.lat}, ${activePlace.location.lng});
        }
        true;
      `);
    }
  }, [activePlace]);

  // Actualizar la ruta trazada
  useEffect(() => {
    if (webViewRef.current) {
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

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; background: #F7F4F0; }
    .custom-pin {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #00AEB7;
      border: 3px solid #FFFFFF;
      box-shadow: 0 4px 10px rgba(0,0,0,0.25);
      color: #FFFFFF;
      font-weight: 900;
      font-size: 14px;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .custom-pin.active {
      background: #FF7A59;
      transform: scale(1.3);
      border-color: #FFFFFF;
      box-shadow: 0 6px 16px rgba(255,122,89,0.5);
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
    .leaflet-control-attribution { font-size: 9px; opacity: 0.6; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    const places = ${JSON.stringify(places)};
    const userLoc = ${JSON.stringify(userLocation)};
    let activeId = '${activePlace?.id || ''}';
    let markersMap = {};
    let routePolyline = null;

    // Inicializar mapa centrado en Atlántico / Barranquilla
    const centerLat = ${activePlace?.location.lat || userLocation?.lat || 10.9685};
    const centerLng = ${activePlace?.location.lng || userLocation?.lng || -74.7813};

    const map = L.map('map', {
      zoomControl: false,
      attributionControl: false
    }).setView([centerLat, centerLng], 12);
    window.map = map;

    // Teselas 100% planas de alta legibilidad (OpenStreetMap HOT: sin relieves, sin sombras, diseño plano)
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: 'abc',
      attribution: '© OpenStreetMap contributors'
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

    // Marcadores de lugares turísticos
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
      map.flyTo([lat, lng], 13, { duration: 0.6 });
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
          opacity: 0.85,
          lineJoin: 'round'
        }).addTo(map);
        map.fitBounds(routePolyline.getBounds(), { padding: [50, 50] });
      }
    };

    window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'MAP_READY' }));
  </script>
</body>
</html>
  `;

  return (
    <View style={StyleSheet.absoluteFill}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={styles.webView}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'SELECT_PLACE') {
              const found = places.find((p) => p.id === data.placeId);
              if (found) onSelectPlace(found);
            } else if (data.type === 'MAP_READY') {
              logEvent('info', 'LEAFLET', 'Motor de mapa Leaflet inicializado y teselas listas');
              onReady?.();
            }
          } catch (err) {
            logEvent('warn', 'LEAFLET', 'Error procesando mensaje de WebView Leaflet', err instanceof Error ? err.message : String(err));
          }
        }}
        onError={(err) => {
          logEvent('error', 'LEAFLET', 'Error cargando WebView de mapa Leaflet', err.nativeEvent.description);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  webView: {
    flex: 1,
    backgroundColor: '#F7F4F0',
  },
});
