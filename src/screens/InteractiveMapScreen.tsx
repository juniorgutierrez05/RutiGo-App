/**
 * 11. Interactive Map Screen - Mapa Turístico Atlántico Real para Web (Vite)
 * Atlántico interactive web map featuring Google Maps integration, 
 * category filters, and live routing using official Directions Service.
 */
import React, { useState, useEffect } from 'react';
import { APIProvider, Map, Marker, useMapsLibrary, useMap } from '@vis.gl/react-google-maps';
import { useApp } from '../store';
import { BottomNav } from '../components/BottomNav';
import { calculateDistanceKm, formatDistance, estimateTravelTimes, ATLANTICO_MUNICIPALITIES } from '../services/locationService';
import { Place, CategoryType } from '../types';

// ⚠️ Coloca aquí tu clave real generada en Google Cloud Console
const GOOGLE_MAPS_APIKEY = 'AIzaSyAvX0Vs49lCXa4-HAo8HVlEAiG6eZ8ZfDY';

// Componente interno encargado de calcular y dibujar la línea de la ruta por las calles web
const DirectionsRenderer: React.FC<{ origen: google.maps.LatLngLiteral; destino: google.maps.LatLngLiteral }> = ({ origen, destino }) => {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    if (!routesLibrary || !map) return;
    
    const renderer = new routesLibrary.DirectionsRenderer({
      map,
      polylineOptions: {
        strokeColor: '#FF7A59', // Color coral de tu app RutiGo
        strokeWeight: 5,
      }
    });
    setDirectionsRenderer(renderer);

    return () => renderer.setMap(null);
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsRenderer || !routesLibrary) return;

    const directionsService = new routesLibrary.DirectionsService();
    directionsService.route({
      origin: origen,
      destination: destino,
      travelMode: google.maps.TravelMode.WALKING, // Cambia a DRIVING si prefieres rutas en auto
    }, (result, status) => {
      if (status === 'OK' && result) {
        directionsRenderer.setDirections(result);
      } else {
        console.error('Error calculando la ruta por las calles:', status);
      }
    });
  }, [directionsRenderer, routesLibrary, origen, destino]);

  return null;
};

export const InteractiveMapScreen: React.FC = () => {
  const { places, selectedPlace, userLocation } = useApp();
  const [activePlace, setActivePlace] = useState<Place | null>(selectedPlace || places[0] || null);
  const [mapCategory, setMapCategory] = useState<CategoryType | 'todas'>('todas');
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('Todos');
  const [webGpsLocation, setWebGpsLocation] = useState<google.maps.LatLngLiteral | null>(null);

  // Obtener GPS del usuario desde el navegador web de manera nativa
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setWebGpsLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.log('El usuario denegó el GPS del navegador o falló:', error),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Filtrar los lugares turísticos
  const visiblePlaces = places.filter((p) => {
    const matchCat = mapCategory === 'todas' || p.category === mapCategory;
    const matchMuni = selectedMunicipality === 'Todos' || p.municipality === selectedMunicipality;
    return matchCat && matchMuni;
  });

  if (!activePlace) {
    return <div className="relative w-full h-screen bg-[#DDE9F0] flex items-center justify-center p-6 text-center">No hay lugares turísticos publicados todavía.</div>;
  }

  // Coordenadas origen para la ruta (Usa GPS del navegador o la del store)
  const queryOrigin = webGpsLocation || (userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : null);
  const queryDestino = { lat: activePlace.location.lat, lng: activePlace.location.lng };

  const distKm = calculateDistanceKm(userLocation, activePlace.location);
  const distText = formatDistance(distKm);
  const { drivingText } = estimateTravelTimes(distKm);

  const getEmojiIcon = (cat: CategoryType) => {
    if (cat === 'cultura') return '🎨';
    if (cat === 'gastronomia') return '🍛';
    if (cat === 'naturaleza') return '🌳';
    return '🏛️';
  };

  return (
    <APIProvider apiKey={GOOGLE_MAPS_APIKEY}>
      <div className="relative w-full h-screen bg-[#DDE9F0] overflow-hidden select-none flex flex-col">
        
        {/* CONTROLES FLOTANTES SUPERIORES (Tu hermoso diseño Claymorphic intacto) */}
        <header className="absolute top-0 left-0 right-0 z-30 max-w-md mx-auto p-4 space-y-2 pointer-events-none">
          <div className="clay-card rounded-full px-4 py-2.5 shadow-md flex items-center justify-between border-2 border-white pointer-events-auto bg-white/90">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">explore</span>
              <div>
                <p className="text-[13px] font-bold text-on-surface">Mapa Turístico Atlántico</p>
                <p className="text-[11px] text-on-surface-variant font-medium">{visiblePlaces.length} puntos</p>
              </div>
            </div>

            <select
              value={selectedMunicipality}
              onChange={(e) => setSelectedMunicipality(e.target.value)}
              className="text-[12px] font-bold text-primary clay-pill-selector px-3 py-1 rounded-full border-none focus:outline-none cursor-pointer"
            >
              <option value="Todos">Todo Atlántico</option>
              {Object.keys(ATLANTICO_MUNICIPALITIES).map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar pointer-events-auto">
            {(['todas', 'cultura', 'gastronomia', 'naturaleza', 'historia'] as const).map((cat) => {
              const isSelected = mapCategory === cat;
              const labels = { todas: 'Todos', cultura: 'Cultura', gastronomia: 'Sabor', naturaleza: 'Naturaleza', historia: 'Historia' };
              return (
                <button
                  key={cat}
                  onClick={() => setMapCategory(cat)}
                  className={`h-9 px-4 rounded-full text-[12px] font-bold whitespace-nowrap transition-all shadow-xs active:scale-95 cursor-pointer ${
                    isSelected ? 'clay-btn-coral text-white shadow-md' : 'clay-card text-on-surface hover:text-primary bg-white/90'
                  }`}
                >
                  {labels[cat]}
                </button>
              );
            })}
          </div>
        </header>

        {/* MAPA REAL DE GOOGLE MAPS PARA WEB */}
        <div className="w-full h-full absolute inset-0 z-10">
          <Map
            defaultCenter={{ lat: activePlace.location.lat || 10.9639, lng: activePlace.location.lng || -74.7964 }}
            defaultZoom={11}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
          >
            {/* Marcadores de sitios turísticos */}
            {visiblePlaces.map((place) => (
              <Marker
                key={place.id}
                position={{ lat: place.location.lat, lng: place.location.lng }}
                title={place.name}
                onClick={() => setActivePlace(place)}
              />
            ))}

            {/* Marcador azul para la posición actual del Turista web si dio permisos */}
            {webGpsLocation && (
              <Marker 
                position={webGpsLocation} 
                title="Tu ubicación actual"
                icon={{
                  url: 'https://google.com'
                }}
              />
            )}

            {/* Renderizador de rutas inteligente por calles de Google */}
            {queryOrigin && queryDestino && (
              <DirectionsRenderer origen={queryOrigin} destino={queryDestino} />
            )}
          </Map>
        </div>

        {/* TARJETA DINÁMICA CLAYMORPHIC INFERIOR */}
        <div className="absolute bottom-24 left-4 right-4 z-30 max-w-md mx-auto pointer-events-auto">
          <div className="clay-card rounded-3xl p-4 border-2 border-white shadow-lg bg-white/95">
            <h3 className="font-bold text-[16px] text-primary">{activePlace.name}</h3>
            <p className="text-[12px] text-on-surface-variant mb-2">📍 {activePlace.municipality} ({getEmojiIcon(activePlace.category)})</p>
            <div className="flex gap-4 text-[12px] font-semibold text-on-surface">
              <span>🚗 En Auto: {drivingText}</span>
              <span>📏 Distancia: {distText}</span>
            </div>
          </div>
        </div>

        <BottomNav activeTabs="interactive_map" />
      </div>
    </APIProvider>
  );
};
