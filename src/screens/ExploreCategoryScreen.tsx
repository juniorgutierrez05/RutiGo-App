/**
 * 6. Explore Category Screen
 * Detailed category view (Cultura, Gastronomía, Naturaleza, Historia)
 * with municipality filters, sorting, and rich card listings.
 */
import React, { useState } from 'react';
import { useApp } from '../store';
import { TopAppBar } from '../components/TopAppBar';
import { BottomNav } from '../components/BottomNav';
import { Card } from '../components/Card';
import { RatingStars } from '../components/RatingStars';
import { calculateDistanceKm, formatDistance } from '../services/locationService';
import { CategoryType } from '../types';

export const ExploreCategoryScreen: React.FC = () => {
  const {
    activeCategory,
    setActiveCategory,
    routes,
    places,
    navigateTo,
    userLocation,
    toggleFavorite,
    isFavorite,
  } = useApp();

  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('Todos');

  // Category Theme Setup
  const getCategoryMeta = (cat: CategoryType) => {
    switch (cat) {
      case 'cultura':
        return {
          title: 'Cultura & Tradiciones',
          subtitle: 'Artesanías en iraca, máscaras y música folclórica',
          icon: 'palette',
          gradient: 'from-[#A895FF]/20 via-white to-[#7B61FF]/10',
          badgeColor: 'bg-[#7B61FF] text-white',
          accent: '#7B61FF',
        };
      case 'gastronomia':
        return {
          title: 'Gastronomía Caribeña',
          subtitle: 'Pastel de Pital, arepa con huevo, ceviches y mariscos',
          icon: 'restaurant',
          gradient: 'from-[#FFB199]/25 via-white to-[#FF7A59]/10',
          badgeColor: 'bg-primary-container text-white',
          accent: '#FF7A59',
        };
      case 'naturaleza':
        return {
          title: 'Naturaleza & Ecoturismo',
          subtitle: 'Campos de girasoles, senderos de montaña y playas doradas',
          icon: 'forest',
          gradient: 'from-[#7BE9A8]/25 via-white to-[#2ECC71]/10',
          badgeColor: 'bg-[#2ECC71] text-white',
          accent: '#2ECC71',
        };
      case 'historia':
        return {
          title: 'Historia & Patrimonio',
          subtitle: 'Muelles centenarios, castillos coloniales y arquitectura caribe',
          icon: 'account_balance',
          gradient: 'from-[#FFE180]/25 via-white to-[#FFC93C]/10',
          badgeColor: 'bg-[#CA9A00] text-white',
          accent: '#CA9A00',
        };
    }
  };

  const meta = getCategoryMeta(activeCategory);

  // Filter items
  const filteredRoutes = routes.filter((r) => {
    const matchCat = r.category === activeCategory;
    const matchMuni =
      selectedMunicipality === 'Todos' || r.municipalities.includes(selectedMunicipality);
    return matchCat && matchMuni;
  });

  const filteredPlaces = places.filter((p) => {
    const matchCat = p.category === activeCategory;
    const matchMuni =
      selectedMunicipality === 'Todos' || p.municipality === selectedMunicipality;
    return matchCat && matchMuni;
  });

  const municipalities = [
    'Todos',
    'Puerto Colombia',
    'Usiacurí',
    'Baranoa',
    'Barranquilla',
    'Piojó',
    'Galapa',
  ];

  return (
    <div className="relative w-full min-h-screen bg-background pb-28">
      <TopAppBar
        title="Explorar Rutas"
        subtitle={meta.title}
        showBack={true}
        showNotifications={true}
      />

      <div className="px-gutter-mobile space-y-4 pt-2 max-w-md mx-auto">
        {/* Category Switcher Tabs */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-surfaceContainerLow rounded-full shadow-inner">
          {(['cultura', 'gastronomia', 'naturaleza', 'historia'] as CategoryType[]).map((cat) => {
            const isSelected = activeCategory === cat;
            const labels = {
              cultura: 'Cultura',
              gastronomia: 'Sabor',
              naturaleza: 'Naturaleza',
              historia: 'Historia',
            };
            const icons = {
              cultura: 'palette',
              gastronomia: 'restaurant',
              naturaleza: 'forest',
              historia: 'account_balance',
            };

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`h-9 rounded-full flex items-center justify-center gap-1 text-label-sm font-bold transition-all duration-150 active:scale-95 ${
                  isSelected
                    ? 'bg-white text-on-surface shadow-sm'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[16px]"
                  style={{
                    color: isSelected ? meta.accent : undefined,
                    fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  {icons[cat]}
                </span>
                <span className="hidden sm:inline">{labels[cat]}</span>
              </button>
            );
          })}
        </div>

        {/* Category Hero Banner */}
        <div
          className={`p-4 rounded-3xl bg-gradient-to-r ${meta.gradient} border border-white/90 shadow-sm relative overflow-hidden`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${meta.badgeColor} shadow-md`}
            >
              <span
                className="material-symbols-outlined text-[26px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {meta.icon}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-headline-sm font-headline-sm font-bold text-on-surface leading-tight">
                {meta.title}
              </h2>
              <p className="text-body-sm font-body-sm text-on-surface-variant mt-0.5">
                {meta.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Municipality Filter Pills */}
        <div className="space-y-1.5">
          <span className="text-label-sm font-label-sm font-bold text-on-surface px-1">
            Filtrar por Municipio:
          </span>
          <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar">
            {municipalities.map((muni) => (
              <button
                key={muni}
                onClick={() => setSelectedMunicipality(muni)}
                className={`h-8 px-3.5 rounded-full text-label-sm font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  selectedMunicipality === muni
                    ? 'bg-primary-container text-white shadow-sm'
                    : 'bg-white text-on-surface-variant border border-[#E9DDD5] hover:bg-surfaceContainerLow'
                }`}
              >
                {muni}
              </button>
            ))}
          </div>
        </div>

        {/* Routes Section */}
        {filteredRoutes.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-label-lg font-label-lg font-bold text-on-surface px-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[20px]">route</span>
              Rutas Completas ({filteredRoutes.length})
            </h3>

            {filteredRoutes.map((route) => (
              <Card
                key={route.id}
                variant="white"
                rounded="2xl"
                padding="none"
                interactive
                onClick={() => navigateTo('route_detail', { routeId: route.id })}
                className="shadow-sm border border-white/90"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={route.coverImageUrl}
                    alt={route.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                    <span className="bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-bold text-primary shadow-xs">
                      {route.difficulty}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite('route', route.id);
                      }}
                      className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-primary shadow-xs"
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        style={{
                          fontVariationSettings: isFavorite('route', route.id)
                            ? "'FILL' 1"
                            : "'FILL' 0",
                        }}
                      >
                        favorite
                      </span>
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h4 className="text-headline-sm font-bold leading-tight">{route.name}</h4>
                    <p className="text-label-sm text-white/90 mt-0.5">
                      {route.durationEstimate} • {route.distanceKm} km
                    </p>
                  </div>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <RatingStars rating={route.avgRating} reviewCount={route.reviewCount} showBadge />
                  <span className="text-label-sm font-bold text-primary flex items-center gap-1">
                    Ver paradas
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Places Section */}
        <div className="space-y-3 pt-2">
          <h3 className="text-label-lg font-label-lg font-bold text-on-surface px-1 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[20px]">place</span>
            Lugares & Paradas ({filteredPlaces.length})
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {filteredPlaces.map((place) => {
              const dist = calculateDistanceKm(userLocation, place.location);
              const distText = formatDistance(dist);

              return (
                <div
                  key={place.id}
                  onClick={() => navigateTo('place_detail', { placeId: place.id })}
                  className="bg-white rounded-2xl p-3 shadow-[0_6px_16px_rgba(46,41,56,0.04)] border border-white/90 flex gap-3 cursor-pointer active:scale-[0.99] transition-all"
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
                        <div className="flex items-center gap-1 text-[11px] text-on-surface-variant font-medium">
                          <span className="material-symbols-outlined text-[13px] text-primary">
                            location_on
                          </span>
                          {distText}
                        </div>
                      </div>
                      <h4 className="text-label-md font-bold text-on-surface leading-tight mt-0.5 line-clamp-1">
                        {place.name}
                      </h4>
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
                      <span className="text-[12px] font-bold text-primary flex items-center">
                        Detalles
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};
