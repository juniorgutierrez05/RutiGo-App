/**
 * 8. Search Results Screen
 * Displays queried routes and places with filter tabs, distance tags, and rating badges.
 */
import React, { useState } from 'react';
import { useApp } from '../store';
import { BottomNav } from '../components/BottomNav';
import { Card } from '../components/Card';
import { RatingStars } from '../components/RatingStars';
import { calculateDistanceKm, formatDistance } from '../services/locationService';
import { IMAGES } from '../assets/images';

export const SearchResultsScreen: React.FC = () => {
  const {
    searchQuery,
    routes,
    places,
    navigateTo,
    goBack,
    userLocation,
    toggleFavorite,
    isFavorite,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'routes' | 'places'>('all');

  const queryLower = searchQuery.toLowerCase();

  // Match routes
  const matchedRoutes = routes.filter(
    (r) =>
      r.name.toLowerCase().includes(queryLower) ||
      r.description.toLowerCase().includes(queryLower) ||
      r.municipalities.some((m) => m.toLowerCase().includes(queryLower)) ||
      r.category.toLowerCase().includes(queryLower)
  );

  // Match places
  const matchedPlaces = places.filter(
    (p) =>
      p.name.toLowerCase().includes(queryLower) ||
      p.description.toLowerCase().includes(queryLower) ||
      p.municipality.toLowerCase().includes(queryLower) ||
      p.category.toLowerCase().includes(queryLower)
  );

  const totalCount =
    activeFilter === 'all'
      ? matchedRoutes.length + matchedPlaces.length
      : activeFilter === 'routes'
      ? matchedRoutes.length
      : matchedPlaces.length;

  return (
    <div className="relative w-full min-h-screen bg-background pb-28">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md px-gutter-mobile py-3 border-b border-[#E9DDD5]/60 shadow-xs">
        <div className="flex items-center gap-2 max-w-md mx-auto">
          <button
            type="button"
            onClick={goBack}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-on-surface hover:text-primary shadow-sm border border-white"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div
            onClick={() => navigateTo('search')}
            className="flex-1 h-10 px-4 rounded-full bg-white border border-[#E9DDD5] flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2 text-on-surface text-body-sm font-semibold">
              <span className="material-symbols-outlined text-primary text-[18px]">search</span>
              <span>{searchQuery}</span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-[16px]">
              edit
            </span>
          </div>
        </div>
      </header>

      <div className="px-gutter-mobile space-y-4 pt-3 max-w-md mx-auto">
        {/* Results Count & Tabs */}
        <div className="flex items-center justify-between">
          <p className="text-body-sm text-on-surface-variant font-medium">
            <span className="font-bold text-on-surface">{totalCount}</span> resultados encontrados
          </p>

          <div className="flex gap-1 bg-surfaceContainerLow p-1 rounded-full">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-full text-label-sm font-bold transition-all ${
                activeFilter === 'all' ? 'bg-white text-primary shadow-xs' : 'text-on-surface-variant'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setActiveFilter('routes')}
              className={`px-3 py-1 rounded-full text-label-sm font-bold transition-all ${
                activeFilter === 'routes'
                  ? 'bg-white text-primary shadow-xs'
                  : 'text-on-surface-variant'
              }`}
            >
              Rutas ({matchedRoutes.length})
            </button>
            <button
              onClick={() => setActiveFilter('places')}
              className={`px-3 py-1 rounded-full text-label-sm font-bold transition-all ${
                activeFilter === 'places'
                  ? 'bg-white text-primary shadow-xs'
                  : 'text-on-surface-variant'
              }`}
            >
              Lugares ({matchedPlaces.length})
            </button>
          </div>
        </div>

        {/* Empty State */}
        {totalCount === 0 && (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-28 h-28 mb-3">
              <img
                src={IMAGES.mascot.iguanaSmiling}
                alt="Sin resultados"
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-headline-sm font-bold text-on-surface">No encontramos coincidencias</h3>
            <p className="text-body-sm text-on-surface-variant max-w-xs mt-1">
              Prueba buscando municipios como "Usiacurí", "Puerto Colombia", o categorías como "Gastronomía".
            </p>
          </div>
        )}

        {/* Matched Routes */}
        {(activeFilter === 'all' || activeFilter === 'routes') && matchedRoutes.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-label-md font-bold text-on-surface">Rutas Recomendadas</h4>
            {matchedRoutes.map((route) => (
              <Card
                key={route.id}
                variant="white"
                rounded="2xl"
                padding="none"
                interactive
                onClick={() => navigateTo('route_detail', { routeId: route.id })}
                className="shadow-sm border border-white/90"
              >
                <div className="relative h-40 w-full overflow-hidden">
                  <img
                    src={route.coverImageUrl}
                    alt={route.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <span className="text-[11px] font-bold text-[#FFD6A5] uppercase">
                      {route.municipalities.join(' • ')}
                    </span>
                    <h5 className="text-label-md font-bold text-white line-clamp-1">{route.name}</h5>
                    <p className="text-[12px] text-white/90">
                      {route.durationEstimate} • {route.distanceKm} km
                    </p>
                  </div>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <RatingStars rating={route.avgRating} reviewCount={route.reviewCount} showBadge />
                  <span className="text-label-sm font-bold text-primary flex items-center gap-1">
                    Ver ruta
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Matched Places */}
        {(activeFilter === 'all' || activeFilter === 'places') && matchedPlaces.length > 0 && (
          <div className="space-y-3 pt-2">
            <h4 className="text-label-md font-bold text-on-surface">Lugares & Puntos de Interés</h4>
            {matchedPlaces.map((place) => {
              const dist = calculateDistanceKm(userLocation, place.location);
              const distText = formatDistance(dist);

              return (
                <div
                  key={place.id}
                  onClick={() => navigateTo('place_detail', { placeId: place.id })}
                  className="bg-white rounded-2xl p-3 shadow-sm border border-white/90 flex gap-3 cursor-pointer active:scale-[0.99] transition-all"
                >
                  <img
                    src={place.images[0]}
                    alt={place.name}
                    className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-primary uppercase">
                          {place.municipality}
                        </span>
                        <span className="text-[11px] text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px] text-primary">
                            location_on
                          </span>
                          {distText}
                        </span>
                      </div>
                      <h5 className="text-label-md font-bold text-on-surface line-clamp-1 mt-0.5">
                        {place.name}
                      </h5>
                      <p className="text-[12px] text-on-surface-variant line-clamp-1 mt-0.5">
                        {place.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <RatingStars
                        rating={place.avgRating}
                        reviewCount={place.reviewCount}
                        showBadge
                      />
                      <span className="text-[12px] font-bold text-primary">Ver detalles</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};
