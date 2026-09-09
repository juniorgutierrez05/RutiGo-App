/**
 * 5. Home Screen
 * Displays department guide header, search trigger, category filters,
 * featured route hero card, nearby places horizontal carousel, and mascot tips.
 */
import React from 'react';
import { useApp } from '../store';
import { TopAppBar } from '../components/TopAppBar';
import { BottomNav } from '../components/BottomNav';
import { Card } from '../components/Card';
import { Chip } from '../components/Chip';
import { RatingStars } from '../components/RatingStars';
import { Button } from '../components/Button';
import { IMAGES } from '../assets/images';
import { calculateDistanceKm, formatDistance } from '../services/locationService';
import { CategoryType } from '../types';

export const HomeScreen: React.FC = () => {
  const {
    routes,
    places,
    navigateTo,
    activeCategory,
    setActiveCategory,
    userLocation,
    toggleFavorite,
    isFavorite,
  } = useApp();

  // Featured Route
  const featuredRoute = routes[0] || null;

  // Filtered places based on category (or all if none)
  const categoryPlaces = places.filter((p) => p.category === activeCategory);

  const handleCategorySelect = (cat: CategoryType) => {
    setActiveCategory(cat);
    navigateTo('explore_category', { category: cat });
  };

  return (
    <div className="relative w-full min-h-screen bg-background pb-28">
      {/* Top App Bar */}
      <TopAppBar
        title="Barranquilla & Atlántico"
        subtitle="Guía costera activa"
        showNotifications={true}
      />

      <div className="px-gutter-mobile space-y-space-md pt-space-xs max-w-md mx-auto">
        {/* Search Bar Trigger */}
        <div
          onClick={() => navigateTo('search')}
          className="w-full h-13 px-4 rounded-full bg-white flex items-center justify-between shadow-[0_10px_22px_-6px_rgba(227,213,202,0.45),inset_0_2px_4px_rgba(255,255,255,0.9)] border border-white/90 cursor-pointer active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined text-primary text-[22px]">search</span>
            <span className="text-body-md font-body-md text-on-surface-variant font-medium">
              Buscar rutas, gastronomía, lugares...
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#FFF5F0] flex items-center justify-center text-primary shadow-xs">
            <span className="material-symbols-outlined text-[18px]">tune</span>
          </div>
        </div>

        {/* 4 Cultural Category Pills */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-label-md font-label-md font-bold text-on-surface">
              Explorar por Categoría
            </h2>
            <button
              onClick={() => navigateTo('explore_category')}
              className="text-label-sm font-label-sm font-bold text-primary hover:underline"
            >
              Ver todas
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar">
            <Chip
              label="Cultura"
              icon="palette"
              category="cultura"
              selected={activeCategory === 'cultura'}
              onClick={() => handleCategorySelect('cultura')}
            />
            <Chip
              label="Gastronomía"
              icon="restaurant"
              category="gastronomia"
              selected={activeCategory === 'gastronomia'}
              onClick={() => handleCategorySelect('gastronomia')}
            />
            <Chip
              label="Naturaleza"
              icon="forest"
              category="naturaleza"
              selected={activeCategory === 'naturaleza'}
              onClick={() => handleCategorySelect('naturaleza')}
            />
            <Chip
              label="Historia"
              icon="account_balance"
              category="historia"
              selected={activeCategory === 'historia'}
              onClick={() => handleCategorySelect('historia')}
            />
          </div>
        </div>

        {/* Hero Card: Ruta Destacada de la Semana */}
        {featuredRoute && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#CA9A00] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  local_fire_department
                </span>
                <h2 className="text-headline-sm font-headline-sm font-bold text-on-surface">
                  Ruta de la Semana
                </h2>
              </div>
              <span className="text-label-sm font-label-sm text-primary font-semibold">
                Recomendado
              </span>
            </div>

            <Card
              variant="white"
              rounded="3xl"
              padding="none"
              interactive
              onClick={() => navigateTo('route_detail', { routeId: featuredRoute.id })}
              className="relative group shadow-[0_18px_36px_-8px_rgba(255,122,89,0.22),0_6px_14px_rgba(46,41,56,0.06)]"
            >
              {/* Cover Image */}
              <div className="relative w-full h-56 overflow-hidden">
                <img
                  src={featuredRoute.coverImageUrl}
                  alt={featuredRoute.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                  <span className="bg-primary-container text-white px-3 py-1 rounded-full text-label-sm font-bold shadow-md">
                    Imperdible
                  </span>
                  <div className="flex items-center gap-2">
                    <RatingStars
                      rating={featuredRoute.avgRating}
                      reviewCount={featuredRoute.reviewCount}
                      showBadge
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite('route', featuredRoute.id);
                      }}
                      className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-primary shadow-sm hover:scale-110 active:scale-95 transition-all"
                    >
                      <span
                        className="material-symbols-outlined text-[20px]"
                        style={{
                          fontVariationSettings: isFavorite('route', featuredRoute.id)
                            ? "'FILL' 1"
                            : "'FILL' 0",
                        }}
                      >
                        favorite
                      </span>
                    </button>
                  </div>
                </div>

                {/* Overlay Text Details */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                  <span className="text-label-sm font-label-sm uppercase tracking-wider text-[#FFD6A5] font-bold">
                    {featuredRoute.subtitle || 'Usiacurí • Baranoa'}
                  </span>
                  <h3 className="text-headline-sm font-headline-sm font-extrabold text-white leading-tight mt-0.5 drop-shadow-md line-clamp-1">
                    {featuredRoute.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5 text-label-sm text-white/90">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                      {featuredRoute.durationEstimate}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">route</span>
                      {featuredRoute.distanceKm} km
                    </span>
                    <span>•</span>
                    <span className="bg-white/25 px-2 py-0.5 rounded-full text-[11px] font-bold backdrop-blur-sm">
                      {featuredRoute.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer with Button */}
              <div className="p-3.5 flex items-center justify-between bg-gradient-to-r from-white to-[#FFF9F5]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px]">place</span>
                  </div>
                  <div>
                    <p className="text-label-sm font-label-sm font-bold text-on-surface">
                      4 paradas mágicas
                    </p>
                    <p className="text-[12px] text-on-surface-variant">
                      Artesanías, techos & mirador
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="primary"
                  icon="arrow_forward"
                  iconPosition="right"
                  onClick={() => navigateTo('route_detail', { routeId: featuredRoute.id })}
                >
                  Explorar
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Horizontal Carousel: Lugares Populares & Cercanos */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[20px]">
                near_me
              </span>
              <h2 className="text-headline-sm font-headline-sm font-bold text-on-surface">
                Lugares Cercanos
              </h2>
            </div>
            <button
              onClick={() => navigateTo('interactive_map')}
              className="text-label-sm font-label-sm font-bold text-primary hover:underline"
            >
              Ver mapa
            </button>
          </div>

          <div className="flex gap-3.5 overflow-x-auto pb-2 -mx-gutter-mobile px-gutter-mobile no-scrollbar">
            {places.slice(0, 6).map((place) => {
              const distanceKm = calculateDistanceKm(userLocation, place.location);
              const distFormatted = formatDistance(distanceKm);

              return (
                <div
                  key={place.id}
                  onClick={() => navigateTo('place_detail', { placeId: place.id })}
                  className="min-w-[220px] max-w-[220px] rounded-[24px] bg-white shadow-[0_12px_24px_-6px_rgba(227,213,202,0.5),inset_0_2px_4px_rgba(255,255,255,0.9)] border border-white/90 overflow-hidden cursor-pointer active:scale-[0.98] transition-all flex-shrink-0"
                >
                  {/* Place Image */}
                  <div className="relative h-28 w-full overflow-hidden">
                    <img
                      src={place.images[0]}
                      alt={place.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <RatingStars rating={place.avgRating} showBadge />
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">location_on</span>
                      {distFormatted}
                    </div>
                  </div>

                  {/* Place Info */}
                  <div className="p-3">
                    <span className="text-[11px] font-bold text-primary uppercase tracking-wide">
                      {place.municipality}
                    </span>
                    <h4 className="text-label-md font-label-md font-bold text-on-surface leading-tight mt-0.5 line-clamp-1">
                      {place.name}
                    </h4>
                    <p className="text-body-sm text-on-surface-variant text-[12px] line-clamp-1 mt-1">
                      {place.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mascot Tip Banner */}
        <Card
          variant="hero"
          rounded="3xl"
          padding="md"
          className="flex items-center gap-3.5 relative overflow-hidden"
        >
          <div className="w-16 h-16 flex-shrink-0 relative">
            <img
              src={IMAGES.mascot.iguanaTip}
              alt="Consejo Iguana RutiGo"
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1 text-primary font-bold text-label-sm">
              <span className="material-symbols-outlined text-[16px]">lightbulb</span>
              <span>¡Consejo RutiGo!</span>
            </div>
            <p className="text-body-sm font-body-sm text-on-surface leading-snug mt-0.5">
              En Usiacurí, visita el Mirador de Cristal temprano en la mañana para disfrutar la mejor vista y la brisa caribeña.
            </p>
          </div>
        </Card>

        {/* Category Spotlights: Culture & Gastronomy */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-headline-sm font-headline-sm font-bold text-on-surface">
              Sabor & Tradición
            </h2>
            <button
              onClick={() => navigateTo('explore_category', { category: 'gastronomia' })}
              className="text-label-sm font-label-sm font-bold text-primary hover:underline"
            >
              Ver menú
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {places
              .filter((p) => p.category === 'gastronomia')
              .slice(0, 2)
              .map((place) => (
                <div
                  key={place.id}
                  onClick={() => navigateTo('place_detail', { placeId: place.id })}
                  className="bg-white rounded-2xl p-2.5 shadow-sm border border-white/90 cursor-pointer active:scale-95 transition-all"
                >
                  <img
                    src={place.images[0]}
                    alt={place.name}
                    className="w-full h-24 object-cover rounded-xl mb-2"
                  />
                  <h4 className="text-label-sm font-bold text-on-surface line-clamp-1">
                    {place.name}
                  </h4>
                  <p className="text-[12px] text-on-surface-variant flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[13px] text-primary">place</span>
                    {place.municipality}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Floating Bottom Navigation */}
      <BottomNav />
    </div>
  );
};
