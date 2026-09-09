/**
 * 15. Favorites Screen - Mis Guardados
 * Tactile Claymorphic design with Caribbean aesthetic
 */
import React, { useState } from 'react';
import { useApp } from '../store';
import { BottomNav } from '../components/BottomNav';

export const FavoritesScreen: React.FC = () => {
  const {
    currentUser,
    routes,
    places,
    navigateTo,
    toggleFavorite,
    goBack,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'routes' | 'places'>('routes');

  const savedRoutesList = routes.filter((r) => currentUser?.savedRoutes.includes(r.id));
  const savedPlacesList = places.filter((p) => currentUser?.savedPlaces.includes(p.id));

  return (
    <div className="w-full min-h-screen bg-mesh-caribbean flex flex-col relative pb-28 overflow-x-hidden text-on-surface">
      {/* TOP APP BAR */}
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md px-5 pt-4 pb-3 flex justify-between items-center w-full shadow-sm">
        <button
          onClick={goBack}
          aria-label="Regresar"
          className="clay-button-circle w-11 h-11 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </button>

        <div className="flex flex-col items-center">
          <h1 className="font-headline-sm text-[18px] text-primary font-bold tracking-tight">
            Mis Guardados
          </h1>
          <span className="text-[11px] text-outline flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50]"></span>
            Rutas y Paradas Favoritas
          </span>
        </div>

        {/* Mascot Avatar */}
        <div className="relative w-11 h-11 rounded-full p-0.5 clay-badge-yellow flex items-center justify-center shadow-md">
          <img
            className="w-full h-full object-cover rounded-full"
            alt="Mascota RutiGo"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3wqUfUANEHM4SGv-sBMgwJ9_fg8NdmxVvRu511ORGgDRwcr5Q9qjvKZETziEebWHZCwhD4d68LqiV1Am68jSsP9JIzS7P3nZIFfnHCztWyxRtS2Vh6zkTmFuz4Obg3R4LkTmNu0YPltLK9VEDSWKIxZ_GRPjnxgpvW3unMV6tYVPp-kCNI__IkqIcj8QxxCoqCcpSkSUBPdFHj3ai8qEg8ti0NZ2mAPT5e0K4I3sQ9WfcbT_aBOGQ"
          />
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="px-5 pt-3 flex flex-col gap-4 flex-1">
        {/* Clay Pill Tab Switcher */}
        <div className="clay-card p-1.5 rounded-full flex items-center gap-1">
          <button
            onClick={() => setActiveTab('routes')}
            className={`flex-1 py-2.5 rounded-full text-[14px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'routes'
                ? 'clay-btn-coral text-white shadow-md'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: activeTab === 'routes' ? "'FILL' 1" : "'FILL' 0" }}>
              alt_route
            </span>
            <span>Rutas ({savedRoutesList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('places')}
            className={`flex-1 py-2.5 rounded-full text-[14px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'places'
                ? 'clay-btn-coral text-white shadow-md'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: activeTab === 'places' ? "'FILL' 1" : "'FILL' 0" }}>
              location_on
            </span>
            <span>Lugares ({savedPlacesList.length})</span>
          </button>
        </div>

        {/* Tab 1: Saved Routes */}
        {activeTab === 'routes' && (
          <div className="flex flex-col gap-4">
            {savedRoutesList.length === 0 ? (
              <div className="clay-card p-8 rounded-[28px] text-center flex flex-col items-center gap-3 my-6">
                <div className="w-16 h-16 rounded-full clay-badge-coral flex items-center justify-center text-white shadow-md">
                  <span className="material-symbols-outlined text-[32px]">favorite_border</span>
                </div>
                <h3 className="text-[17px] font-bold text-on-surface">No tienes rutas guardadas</h3>
                <p className="text-[13px] text-on-surface-variant max-w-xs leading-relaxed">
                  Explora las rutas turísticas del Atlántico y toca el corazón para tenerlas siempre a mano.
                </p>
                <button
                  onClick={() => navigateTo('home')}
                  className="clay-button-primary px-5 py-2.5 rounded-full text-white text-[14px] font-bold mt-2 shadow-md active:scale-95 transition-transform cursor-pointer"
                >
                  Explorar Rutas
                </button>
              </div>
            ) : (
              savedRoutesList.map((route) => (
                <div
                  key={route.id}
                  onClick={() => navigateTo('route_detail', { routeId: route.id })}
                  className="clay-card rounded-[26px] overflow-hidden group cursor-pointer active:scale-[0.98] transition-all"
                >
                  <div className="relative h-44 w-full overflow-hidden">
                    <img
                      src={route.coverImageUrl}
                      alt={route.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Favorite Heart Action */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite('route', route.id);
                      }}
                      className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-primary flex items-center justify-center shadow-md active:scale-90 transition-transform cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        favorite
                      </span>
                    </button>

                    {/* Category Tag */}
                    <div className="absolute top-3 left-3">
                      <span className="clay-badge-cultura px-2.5 py-0.5 rounded-full text-white text-[10px] font-bold uppercase tracking-wider">
                        {route.category}
                      </span>
                    </div>

                    {/* Bottom Route Info */}
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <span className="text-[11px] font-bold text-[#FFD6A5] uppercase tracking-wide">
                        {route.municipalities.join(' • ')}
                      </span>
                      <h3 className="text-[17px] font-bold leading-snug line-clamp-1 mt-0.5 drop-shadow-sm">
                        {route.name}
                      </h3>
                      <p className="text-[12px] text-white/90 mt-0.5 flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          {route.durationEstimate}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">directions_car</span>
                          {route.distanceKm} km
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 flex items-center justify-between">
                    <div className="clay-badge-yellow px-2.5 py-1 rounded-full text-white text-[12px] font-extrabold flex items-center gap-1 shadow-xs">
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span>{route.avgRating.toFixed(1)}</span>
                      <span className="opacity-80 font-normal">({route.reviewCount})</span>
                    </div>

                    <span className="text-[13px] font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Ver ruta
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Saved Places */}
        {activeTab === 'places' && (
          <div className="flex flex-col gap-3">
            {savedPlacesList.length === 0 ? (
              <div className="clay-card p-8 rounded-[28px] text-center flex flex-col items-center gap-3 my-6">
                <div className="w-16 h-16 rounded-full clay-badge-turquesa flex items-center justify-center text-white shadow-md">
                  <span className="material-symbols-outlined text-[32px]">location_off</span>
                </div>
                <h3 className="text-[17px] font-bold text-on-surface">No tienes lugares guardados</h3>
                <p className="text-[13px] text-on-surface-variant max-w-xs leading-relaxed">
                  Guarda tus paradas predilectas como playas, miradores, talleres artesanales o restaurantes.
                </p>
                <button
                  onClick={() => navigateTo('home')}
                  className="clay-button-primary px-5 py-2.5 rounded-full text-white text-[14px] font-bold mt-2 shadow-md active:scale-95 transition-transform cursor-pointer"
                >
                  Explorar Lugares
                </button>
              </div>
            ) : (
              savedPlacesList.map((place) => (
                <div
                  key={place.id}
                  onClick={() => navigateTo('place_detail', { placeId: place.id })}
                  className="clay-card rounded-[24px] p-3 flex gap-3 cursor-pointer active:scale-[0.98] transition-all group"
                >
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border-2 border-white shadow-xs relative">
                    <img
                      src={place.images[0]}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-primary uppercase tracking-wide">
                          {place.municipality}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite('place', place.id);
                          }}
                          className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary active:scale-90 transition-transform cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            favorite
                          </span>
                        </button>
                      </div>

                      <h4 className="text-[14px] font-bold text-on-surface line-clamp-1 leading-snug mt-0.5">
                        {place.name}
                      </h4>
                      <p className="text-[12px] text-on-surface-variant line-clamp-1 mt-0.5">
                        {place.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1 text-[12px] font-bold text-[#FF9800]">
                        <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          star
                        </span>
                        <span>{place.avgRating.toFixed(1)}</span>
                      </div>
                      <span className="text-[12px] font-bold text-secondary group-hover:underline">
                        Ver detalles →
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

