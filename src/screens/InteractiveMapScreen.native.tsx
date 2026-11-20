import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LeafletMapView } from '../components/LeafletMapView.native';
import { calculateDistanceKm, openExternalNavigation } from '../services/locationService';
import { logEvent } from '../services/logger';
import { useApp } from '../store';
import { Place } from '../types';

type RouteResult = {
  coords: { latitude: number; longitude: number }[];
  distanceKm: number;
  durationMin: number;
};

export type PlaceTypeFilter = 'all' | 'tourist' | 'mall' | 'restaurant';

// Caché en memoria de rutas calculadas para respuesta instantánea (0ms)
const routeCache = new Map<string, RouteResult>();

export function InteractiveMapScreen() {
  const { places, selectedPlace, userLocation, goBack, refreshLocation } = useApp();
  const insets = useSafeAreaInsets();

  // Estados de mapa y ruta
  const [active, setActive] = useState<Place | null>(selectedPlace || null);
  const [showRoute, setShowRoute] = useState(false);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const [routeInfo, setRouteInfo] = useState<{ distanceKm: number; durationMin: number } | null>(null);

  // Estados de búsqueda y filtros
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<PlaceTypeFilter>('all');
  const [municipalityFilter, setMunicipalityFilter] = useState<string>('all');
  const [showFilterModal, setShowFilterModal] = useState(false);

  const mapRef = useRef<{
    centerOn: (lat: number, lng: number, zoom?: number) => void;
    fitPlaces: (placesList: Place[]) => void;
  } | null>(null);

  useEffect(() => {
    logEvent('info', 'MAP', `Pantalla de mapa abierta con ${places.length} lugares cargados`, {
      userLocation,
      initialActivePlace: active?.name,
    });
    refreshLocation();
    if (!selectedPlace && userLocation?.lat && mapRef.current) {
      mapRef.current.centerOn(userLocation.lat, userLocation.lng, 14);
    }
  }, []);

  useEffect(() => {
    if (!active && userLocation?.lat && mapRef.current) {
      mapRef.current.centerOn(userLocation.lat, userLocation.lng, 14);
    }
  }, [userLocation]);

  useEffect(() => {
    setShowRoute(false);
    setRouteCoords([]);
    setRouteInfo(null);
  }, [active]);

  // Lista de municipios únicos ordenados alfabéticamente
  const municipalities = useMemo(() => {
    const set = new Set<string>();
    places.forEach((p) => {
      if (p.municipality && p.municipality.trim()) {
        set.add(p.municipality.trim());
      }
    });
    return Array.from(set).sort();
  }, [places]);

  // Filtrado de lugares por tipo, municipio y búsqueda de texto
  const filteredPlaces = useMemo(() => {
    return places.filter((p) => {
      const tagLower = (p.tag || '').toLowerCase();
      const nameLower = p.name.toLowerCase();
      const descLower = (p.description || '').toLowerCase();

      // Filtro por tipo de lugar
      if (typeFilter === 'mall') {
        const isMall =
          tagLower.includes('centro comercial') ||
          tagLower.includes('mall') ||
          nameLower.includes('centro comercial') ||
          nameLower.includes('mallplaza') ||
          nameLower.includes('viva barranquilla') ||
          nameLower.includes('buenavista') ||
          nameLower.includes('carnaval') ||
          nameLower.includes('gran plaza');
        if (!isMall) return false;
      } else if (typeFilter === 'restaurant') {
        const isRest =
          p.category === 'gastronomia' ||
          nameLower.includes('restaurante') ||
          tagLower.includes('cocina') ||
          tagLower.includes('culinario') ||
          tagLower.includes('gastronomía') ||
          tagLower.includes('gastronomia') ||
          descLower.includes('plato típico') ||
          descLower.includes('butifarra') ||
          descLower.includes('bollo');
        if (!isRest) return false;
      } else if (typeFilter === 'tourist') {
        const isMall =
          tagLower.includes('centro comercial') ||
          tagLower.includes('mall') ||
          nameLower.includes('centro comercial');
        if (isMall) return false;
      }

      // Filtro por municipio / zona
      if (municipalityFilter !== 'all') {
        if (p.municipality.trim().toLowerCase() !== municipalityFilter.trim().toLowerCase()) {
          return false;
        }
      }

      // Filtro por texto en búsqueda
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matches =
          nameLower.includes(q) ||
          p.municipality.toLowerCase().includes(q) ||
          tagLower.includes(q) ||
          descLower.includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [places, typeFilter, municipalityFilter, searchQuery]);

  // Cantidad de filtros activos (excluyendo búsqueda)
  const activeFilterCount = (typeFilter !== 'all' ? 1 : 0) + (municipalityFilter !== 'all' ? 1 : 0);

  // Sugerencias de autocompletado en búsqueda
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim() || !isSearching) return [];
    return filteredPlaces.slice(0, 5);
  }, [filteredPlaces, searchQuery, isSearching]);

  const selectPlaceFromList = (place: Place) => {
    setActive(place);
    mapRef.current?.centerOn(place.location.lat, place.location.lng, 15);
    Keyboard.dismiss();
  };

  const resetFilters = () => {
    setTypeFilter('all');
    setMunicipalityFilter('all');
    setSearchQuery('');
    if (places.length > 0) {
      mapRef.current?.fitPlaces(places);
    }
  };

  const fetchStreetRoute = async (
    start: { lat: number; lng: number },
    dest: { lat: number; lng: number }
  ): Promise<RouteResult> => {
    const cacheKey = `${start.lat.toFixed(4)},${start.lng.toFixed(4)}->${dest.lat.toFixed(4)},${dest.lng.toFixed(4)}`;
    if (routeCache.has(cacheKey)) {
      return routeCache.get(cacheKey)!;
    }

    const endpoints = [
      `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${dest.lng},${dest.lat}?overview=full&geometries=geojson&alternatives=true`,
      `https://routing.openstreetmap.de/routed-car/route/v1/driving/${start.lng},${start.lat};${dest.lng},${dest.lat}?overview=full&geometries=geojson&alternatives=true`,
      `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${dest.lng},${dest.lat}?overview=full&geometries=geojson`,
    ];

    for (const url of endpoints) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7000);
        const res = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'RutiGoApp/1.0 (Android; Mobile)',
          },
        });
        clearTimeout(timeoutId);

        if (!res.ok) continue;
        const data = await res.json();
        if (data.code === 'Ok' && Array.isArray(data.routes) && data.routes.length > 0) {
          const shortestRoute = data.routes.reduce((best: any, candidate: any) => {
            if (!candidate?.geometry?.coordinates?.length) return best;
            if (!best) return candidate;
            return candidate.distance < best.distance ? candidate : best;
          }, data.routes[0]);

          if (Array.isArray(shortestRoute?.geometry?.coordinates) && shortestRoute.geometry.coordinates.length > 1) {
            const result: RouteResult = {
              coords: shortestRoute.geometry.coordinates.map((c: [number, number]) => ({
                latitude: c[1],
                longitude: c[0],
              })),
              distanceKm: shortestRoute.distance / 1000,
              durationMin: Math.max(1, Math.round(shortestRoute.duration / 60)),
            };
            routeCache.set(cacheKey, result);
            return result;
          }
        }
      } catch {
        // Continuar al siguiente endpoint
      }
    }

    const directKm = calculateDistanceKm(start, dest);
    const approxDrivingMin = Math.max(2, Math.round((directKm / 42) * 60));
    return {
      coords: [
        { latitude: start.lat, longitude: start.lng },
        { latitude: dest.lat, longitude: dest.lng },
      ],
      distanceKm: directKm,
      durationMin: approxDrivingMin,
    };
  };

  const directions = async () => {
    if (!active) return;
    setLoadingRoute(true);

    const origin = userLocation;
    logEvent('info', 'ROUTE', `Calculando ruta hacia ${active.name}`, {
      origen: origin,
      destino: active.location,
    });

    try {
      const result = await fetchStreetRoute(origin, active.location);
      if (result && result.coords.length > 0) {
        setRouteCoords(result.coords);
        setRouteInfo({ distanceKm: result.distanceKm, durationMin: result.durationMin });
        setShowRoute(true);
        logEvent('info', 'ROUTE', `Ruta calculada con éxito: ${result.distanceKm.toFixed(1)} km · ${result.durationMin} min`);
      }
    } catch (err) {
      logEvent('error', 'ROUTE', `Error al calcular ruta hacia ${active.name}`, err instanceof Error ? err.message : String(err));
    } finally {
      setLoadingRoute(false);
    }
  };

  const openExternalGps = () => {
    if (!active) return;
    logEvent('info', 'MAP', `Abriendo navegación externa GPS para ${active.name}`);
    openExternalNavigation(active.location.lat, active.location.lng, active.name);
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
        places={filteredPlaces}
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

      {/* Panel Superior del Mapa: Búsqueda y Botón de Filtros */}
      <View style={[styles.header, { top: Math.max(insets.top, 20) + 8 }]}>
        {isSearching ? (
          <View style={styles.searchBarRow}>
            <Pressable
              onPress={() => {
                setIsSearching(false);
                setSearchQuery('');
              }}
              hitSlop={8}
              style={styles.headerIconBtn}
            >
              <Ionicons name="arrow-back" size={24} color="#E60124" />
            </Pressable>
            <View style={styles.searchInputWrap}>
              <Ionicons name="search-outline" size={18} color="#806F69" style={{ marginRight: 6 }} />
              <TextInput
                autoFocus
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Buscar lugares o municipios..."
                placeholderTextColor="#9CA3AF"
                style={styles.searchInput}
                returnKeyType="search"
              />
              {Boolean(searchQuery) && (
                <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
                  <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                </Pressable>
              )}
            </View>
            <Pressable
              onPress={() => {
                setIsSearching(false);
                setSearchQuery('');
              }}
              hitSlop={8}
              style={styles.headerCloseSearchBtn}
            >
              <Text style={styles.cancelText}>Listo</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.headerDefaultRow}>
            <Pressable onPress={goBack} hitSlop={8} style={styles.headerIconBtn}>
              <Ionicons name="chevron-back" size={26} color="#E60124" />
            </Pressable>
            <View style={styles.headerTitleWrap}>
              <Text style={styles.title} numberOfLines={1}>Mapa interactivo</Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                {filteredPlaces.length} {filteredPlaces.length === 1 ? 'lugar' : 'lugares'}
                {municipalityFilter !== 'all' ? ` · ${municipalityFilter}` : ''}
                {typeFilter === 'tourist'
                  ? ' · Zonas turísticas'
                  : typeFilter === 'mall'
                  ? ' · Centros comerciales'
                  : typeFilter === 'restaurant'
                  ? ' · Restaurantes'
                  : ' · Atlántico'}
              </Text>
            </View>

            <View style={styles.headerActions}>
              <Pressable
                style={styles.headerActionBtn}
                onPress={() => setIsSearching(true)}
                hitSlop={8}
              >
                <Ionicons name="search" size={20} color="#1E1927" />
              </Pressable>

              <Pressable
                style={[styles.headerActionBtn, activeFilterCount > 0 && styles.headerActionBtnFiltered]}
                onPress={() => setShowFilterModal(true)}
                hitSlop={8}
              >
                <Ionicons
                  name="options-outline"
                  size={20}
                  color={activeFilterCount > 0 ? '#E60124' : '#1E1927'}
                />
                {activeFilterCount > 0 && (
                  <View style={styles.filterBadge}>
                    <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
                  </View>
                )}
              </Pressable>
            </View>
          </View>
        )}
      </View>

      {/* Carrusel Deslizable de Filtros Rápidos (Zonas turísticas, Centros Comerciales, Restaurantes, Municipios) */}
      <View style={[styles.chipsContainer, { top: Math.max(insets.top, 20) + 68 }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Botón principal de Filtros */}
          <Pressable
            style={[styles.chip, activeFilterCount > 0 && styles.chipActiveRed]}
            onPress={() => setShowFilterModal(true)}
          >
            <Ionicons
              name="options"
              size={13}
              color={activeFilterCount > 0 ? '#FFFFFF' : '#1E1927'}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.chipText, activeFilterCount > 0 && styles.chipTextWhite]}>
              Filtros{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
            </Text>
          </Pressable>

          {/* Chip Todos */}
          <Pressable
            style={[
              styles.chip,
              typeFilter === 'all' && municipalityFilter === 'all' && styles.chipActiveDark,
            ]}
            onPress={resetFilters}
          >
            <Text
              style={[
                styles.chipText,
                typeFilter === 'all' && municipalityFilter === 'all' && styles.chipTextWhite,
              ]}
            >
              ✨ Todos ({places.length})
            </Text>
          </Pressable>

          {/* Categoría: Zonas Turísticas */}
          <Pressable
            style={[styles.chip, typeFilter === 'tourist' && styles.chipActiveRed]}
            onPress={() => {
              const next = typeFilter === 'tourist' ? 'all' : 'tourist';
              setTypeFilter(next);
            }}
          >
            <Text style={[styles.chipText, typeFilter === 'tourist' && styles.chipTextWhite]}>
              🏛️ Zonas turísticas
            </Text>
          </Pressable>

          {/* Categoría: Centros Comerciales */}
          <Pressable
            style={[styles.chip, typeFilter === 'mall' && styles.chipActiveBlue]}
            onPress={() => {
              const next = typeFilter === 'mall' ? 'all' : 'mall';
              setTypeFilter(next);
            }}
          >
            <Text style={[styles.chipText, typeFilter === 'mall' && styles.chipTextWhite]}>
              🛍️ Centros comerciales
            </Text>
          </Pressable>

          {/* Categoría: Restaurantes */}
          <Pressable
            style={[styles.chip, typeFilter === 'restaurant' && styles.chipActiveOrange]}
            onPress={() => {
              const next = typeFilter === 'restaurant' ? 'all' : 'restaurant';
              setTypeFilter(next);
            }}
          >
            <Text style={[styles.chipText, typeFilter === 'restaurant' && styles.chipTextWhite]}>
              🍽️ Restaurantes
            </Text>
          </Pressable>

          <View style={styles.chipDivider} />

          {/* Municipios / Zonas del Atlántico */}
          {municipalities.map((muni) => {
            const isSel = municipalityFilter.toLowerCase() === muni.toLowerCase();
            return (
              <Pressable
                key={muni}
                style={[styles.chip, isSel && styles.chipActiveMuni]}
                onPress={() => {
                  const next = isSel ? 'all' : muni;
                  setMunicipalityFilter(next);
                  if (next !== 'all') {
                    const muniPlaces = places.filter(
                      (p) => p.municipality.toLowerCase() === next.toLowerCase()
                    );
                    if (muniPlaces.length > 0) {
                      mapRef.current?.fitPlaces(muniPlaces);
                    }
                  }
                }}
              >
                <Ionicons
                  name="location-sharp"
                  size={12}
                  color={isSel ? '#FFFFFF' : '#E60124'}
                  style={{ marginRight: 4 }}
                />
                <Text style={[styles.chipText, isSel && styles.chipTextWhite]}>
                  {muni}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Lista Flotante de Sugerencias de Búsqueda */}
      {isSearching && searchQuery.trim().length > 0 && (
        <View style={[styles.suggestionsCard, { top: Math.max(insets.top, 20) + 64 }]}>
          {searchSuggestions.length > 0 ? (
            <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 220 }}>
              {searchSuggestions.map((place) => {
                const tagL = (place.tag || '').toLowerCase();
                const nameL = place.name.toLowerCase();
                const isMall =
                  tagL.includes('centro comercial') ||
                  tagL.includes('mall') ||
                  nameL.includes('centro comercial');
                const isRest =
                  place.category === 'gastronomia' || nameL.includes('restaurante');
                const emoji = isMall ? '🛍️' : isRest ? '🍽️' : '🏛️';

                return (
                  <Pressable
                    key={place.id}
                    style={styles.suggestionItem}
                    onPress={() => {
                      selectPlaceFromList(place);
                      setIsSearching(false);
                    }}
                  >
                    <Text style={styles.suggestionEmoji}>{emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.suggestionName} numberOfLines={1}>{place.name}</Text>
                      <Text style={styles.suggestionSub} numberOfLines={1}>
                        {place.municipality} {place.tag ? `· ${place.tag}` : ''}
                      </Text>
                    </View>
                    <Ionicons name="arrow-forward-circle" size={18} color="#E60124" />
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : (
            <View style={styles.suggestionEmpty}>
              <Ionicons name="search-outline" size={22} color="#9CA3AF" />
              <Text style={styles.suggestionEmptyText}>
                No se encontraron lugares para "{searchQuery}"
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Aviso si ningún lugar coincide con los filtros */}
      {filteredPlaces.length === 0 && (
        <View style={[styles.emptyBanner, { top: Math.max(insets.top, 20) + 116 }]}>
          <Ionicons name="alert-circle-outline" size={18} color="#E60124" />
          <Text style={styles.emptyBannerText}>No hay lugares con los filtros actuales</Text>
          <Pressable onPress={resetFilters} style={styles.emptyBannerBtn}>
            <Text style={styles.emptyBannerBtnText}>Restablecer</Text>
          </Pressable>
        </View>
      )}

      {/* FAB: Botón Flotante "Mi Ubicación" */}
      <Pressable
        style={[styles.myLocationFab, { top: Math.max(insets.top, 20) + 118 }]}
        onPress={centerOnUser}
        hitSlop={8}
      >
        <Ionicons name="locate" size={22} color="#1E1927" />
      </Pressable>

      {/* Ficha Inferior de Información y Ruta */}
      {active ? (
        <View style={[styles.card, { bottom: Math.max(insets.bottom, 12) + 12 }]}>
          <View style={styles.cardHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.municipality}>{active.municipality}</Text>
              <Text style={styles.name}>{active.name}</Text>
            </View>
            <Pressable onPress={() => setActive(null)} hitSlop={8} style={styles.cardCloseBtn}>
              <Ionicons name="close" size={18} color="#9CA3AF" />
            </Pressable>
          </View>

          <Text style={styles.description} numberOfLines={2}>{active.description}</Text>

          {routeInfo && (
            <View style={styles.routeBadge}>
              <Ionicons name="navigate-circle" size={16} color="#E60124" />
              <Text style={styles.routeBadgeText}>
                Ruta más corta: {routeInfo.distanceKm.toFixed(1)} km · ~{routeInfo.durationMin} min
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
                  {showRoute && routeCoords.length > 0 ? 'Recalcular ruta' : 'Ver ruta más corta'}
                </Text>
              )}
            </Pressable>

            <Pressable
              style={[styles.button, styles.mapsButton]}
              onPress={openExternalGps}
            >
              <View style={styles.mapsBtnRow}>
                <Text style={styles.mapsButtonText}>GPS Externo</Text>
                <Ionicons name="navigate-outline" size={14} color="#5DB872" />
              </View>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={[styles.card, { bottom: Math.max(insets.bottom, 12) + 12 }]}>
          <View style={styles.userLocationNotice}>
            <View style={styles.userLocationDot} />
            <View style={{ flex: 1 }}>
              <Text style={styles.userLocationTitle}>Explorando el Atlántico</Text>
              <Text style={styles.userLocationSub}>
                Toca cualquier marcador (🏛️ Turístico · 🛍️ Comercial · 🍽️ Restaurante) para ver detalles y trazar tu ruta.
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Modal Completo de Filtros */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowFilterModal(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setShowFilterModal(false)}>
          <Pressable
            style={[
              styles.modalSheet,
              { paddingBottom: Math.max(insets.bottom, 16) + 16 },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Filtrar ubicaciones</Text>
                <Text style={styles.modalSub}>
                  Encuentra exactamente lo que buscas en el Atlántico
                </Text>
              </View>
              <Pressable
                onPress={() => setShowFilterModal(false)}
                hitSlop={8}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={22} color="#1E1927" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 380 }}>
              {/* Sección 1: Categoría / Tipo de lugar */}
              <Text style={styles.modalSectionLabel}>Tipo de lugar</Text>
              <View style={styles.typeOptionsList}>
                {[
                  {
                    key: 'all',
                    label: 'Todos los tipos',
                    icon: '✨',
                    desc: 'Ver todos los puntos y atractivos sin distinción',
                  },
                  {
                    key: 'tourist',
                    label: 'Zonas turísticas',
                    icon: '🏛️',
                    desc: 'Senderos, miradores, playas, monumentos y museos',
                  },
                  {
                    key: 'mall',
                    label: 'Centros comerciales',
                    icon: '🛍️',
                    desc: 'Malls, tiendas, compras y entretenimiento moderno',
                  },
                  {
                    key: 'restaurant',
                    label: 'Restaurantes',
                    icon: '🍽️',
                    desc: 'Gastronomía caribeña, sabores típicos y paraderos culinarios',
                  },
                ].map((item) => {
                  const isSelected = typeFilter === item.key;
                  return (
                    <Pressable
                      key={item.key}
                      style={[
                        styles.typeOptionCard,
                        isSelected && styles.typeOptionCardSelected,
                      ]}
                      onPress={() => setTypeFilter(item.key as PlaceTypeFilter)}
                    >
                      <Text style={styles.typeOptionIcon}>{item.icon}</Text>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            styles.typeOptionTitle,
                            isSelected && styles.typeOptionTitleSelected,
                          ]}
                        >
                          {item.label}
                        </Text>
                        <Text style={styles.typeOptionDesc}>{item.desc}</Text>
                      </View>
                      {isSelected && (
                        <Ionicons name="checkmark-circle" size={22} color="#E60124" />
                      )}
                    </Pressable>
                  );
                })}
              </View>

              {/* Sección 2: Municipio / Zona */}
              <Text style={[styles.modalSectionLabel, { marginTop: 20 }]}>
                Municipio o Zona del Atlántico
              </Text>
              <View style={styles.muniChipsWrap}>
                <Pressable
                  style={[
                    styles.muniChip,
                    municipalityFilter === 'all' && styles.muniChipSelected,
                  ]}
                  onPress={() => setMunicipalityFilter('all')}
                >
                  <Text
                    style={[
                      styles.muniChipText,
                      municipalityFilter === 'all' && styles.muniChipTextSelected,
                    ]}
                  >
                    ✨ Todos los municipios
                  </Text>
                </Pressable>

                {municipalities.map((muni) => {
                  const isSel = municipalityFilter.toLowerCase() === muni.toLowerCase();
                  return (
                    <Pressable
                      key={muni}
                      style={[styles.muniChip, isSel && styles.muniChipSelected]}
                      onPress={() => setMunicipalityFilter(muni)}
                    >
                      <Ionicons
                        name="location"
                        size={13}
                        color={isSel ? '#FFFFFF' : '#E60124'}
                        style={{ marginRight: 4 }}
                      />
                      <Text
                        style={[
                          styles.muniChipText,
                          isSel && styles.muniChipTextSelected,
                        ]}
                      >
                        {muni}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>

            {/* Footer de Acciones del Modal */}
            <View style={styles.modalFooter}>
              {activeFilterCount > 0 && (
                <Pressable style={styles.modalResetBtn} onPress={resetFilters}>
                  <Text style={styles.modalResetText}>Limpiar</Text>
                </Pressable>
              )}
              <Pressable
                style={[
                  styles.modalApplyBtn,
                  activeFilterCount === 0 && { flex: 1 },
                ]}
                onPress={() => {
                  setShowFilterModal(false);
                  if (filteredPlaces.length > 0) {
                    mapRef.current?.fitPlaces(filteredPlaces);
                  }
                }}
              >
                <Text style={styles.modalApplyText}>
                  Ver {filteredPlaces.length} {filteredPlaces.length === 1 ? 'ubicación' : 'ubicaciones'}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },

  // Header flotante superior
  header: {
    position: 'absolute',
    left: 14,
    right: 14,
    backgroundColor: '#FFFFFFFA',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 9,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#ECECEC',
    zIndex: 100,
  },
  headerDefaultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconBtn: {
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    flex: 1,
  },
  title: { color: '#1E1927', fontSize: 16, fontWeight: '900' },
  subtitle: { color: '#6B7280', fontSize: 11, marginTop: 1, fontWeight: '600' },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActionBtnFiltered: {
    backgroundColor: '#FDE8EA',
    borderWidth: 1,
    borderColor: '#E60124',
  },
  filterBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: '#E60124',
    width: 17,
    height: 17,
    borderRadius: 8.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },

  // Barra de búsqueda en el header
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 38,
  },
  searchInput: {
    flex: 1,
    color: '#1E1927',
    fontSize: 13,
    fontWeight: '600',
    paddingVertical: 0,
  },
  headerCloseSearchBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  cancelText: {
    color: '#E60124',
    fontSize: 13,
    fontWeight: '800',
  },

  // Carrusel de chips de filtro horizontal
  chipsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 90,
  },
  chipsScroll: {
    paddingHorizontal: 14,
    gap: 8,
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFFFA',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ECECEC',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  chipActiveRed: {
    backgroundColor: '#E60124',
    borderColor: '#E60124',
  },
  chipActiveBlue: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  chipActiveOrange: {
    backgroundColor: '#EA580C',
    borderColor: '#EA580C',
  },
  chipActiveDark: {
    backgroundColor: '#1E1927',
    borderColor: '#1E1927',
  },
  chipActiveMuni: {
    backgroundColor: '#E60124',
    borderColor: '#E60124',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E1927',
  },
  chipTextWhite: {
    color: '#FFFFFF',
  },
  chipDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 2,
  },

  // Tarjeta de sugerencias de búsqueda
  suggestionsCard: {
    position: 'absolute',
    left: 14,
    right: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ECECEC',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 110,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 10,
  },
  suggestionEmoji: {
    fontSize: 18,
  },
  suggestionName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E1927',
  },
  suggestionSub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  suggestionEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 6,
  },
  suggestionEmptyText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },

  // Banner cuando no hay resultados
  emptyBanner: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: '#FFF1F2',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#FECDD3',
    zIndex: 85,
  },
  emptyBannerText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#9F1239',
  },
  emptyBannerBtn: {
    backgroundColor: '#E60124',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  emptyBannerBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  // FAB Mi ubicación
  myLocationFab: {
    position: 'absolute',
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFFFA',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#ECECEC',
    zIndex: 50,
  },

  // Ficha de detalle de lugar y ruta
  card: {
    position: 'absolute',
    left: 14,
    right: 14,
    backgroundColor: '#FFFFFFFA',
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#ECECEC',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 8,
    zIndex: 50,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  cardCloseBtn: {
    padding: 4,
  },
  municipality: {
    color: '#E60124',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  name: { color: '#1E1927', fontSize: 17, fontWeight: '900', marginTop: 2 },
  description: { color: '#6B7280', fontSize: 12, marginTop: 4, lineHeight: 16 },
  buttonRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  button: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: { backgroundColor: '#E60124', flex: 1.3 },
  mapsButton: { backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#5DB872' },
  buttonText: { color: '#FFFFFF', fontWeight: '900', fontSize: 13 },
  mapsButtonText: { color: '#5DB872', fontWeight: '900', fontSize: 13 },
  mapsBtnRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  routeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FDE8EA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  routeBadgeText: {
    color: '#E60124',
    fontSize: 12,
    fontWeight: '800',
  },
  userLocationNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userLocationDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#5DB872',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#5DB872',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  userLocationTitle: {
    color: '#1E1927',
    fontSize: 15,
    fontWeight: '900',
  },
  userLocationSub: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },

  // Modal de Filtros
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    paddingTop: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1E1927',
  },
  modalSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSectionLabel: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1E1927',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 14,
    marginBottom: 10,
  },
  typeOptionsList: {
    gap: 8,
  },
  typeOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#ECECEC',
    gap: 12,
  },
  typeOptionCardSelected: {
    backgroundColor: '#FFF5F6',
    borderColor: '#E60124',
  },
  typeOptionIcon: {
    fontSize: 22,
  },
  typeOptionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E1927',
  },
  typeOptionTitleSelected: {
    color: '#E60124',
  },
  typeOptionDesc: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
    lineHeight: 14,
  },
  muniChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  muniChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  muniChipSelected: {
    backgroundColor: '#E60124',
    borderColor: '#E60124',
  },
  muniChipText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#374151',
  },
  muniChipTextSelected: {
    color: '#FFFFFF',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  modalResetBtn: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalResetText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6B7280',
  },
  modalApplyBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: '#E60124',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalApplyText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
