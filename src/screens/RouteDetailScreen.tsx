/**
 * 9. Route Detail Screen
 * Comprehensive route profile with hero photography, itinerary checkpoints,
 * travel tips, and direct launch into the interactive map.
 */
import React from 'react';
import { useApp } from '../store';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { RatingStars } from '../components/RatingStars';
import { IMAGES } from '../assets/images';

export const RouteDetailScreen: React.FC = () => {
  const {
    selectedRoute,
    places,
    navigateTo,
    goBack,
    toggleFavorite,
    isFavorite,
  } = useApp();

  const route = selectedRoute || {
    id: 'route_usiacuri',
    name: 'Ruta del Tejido & Color: Usiacurí Mágico',
    subtitle: 'Usiacurí — Baranoa',
    description:
      'Descubre el pueblo más pacífico del Atlántico con techos pintados de aves caribeñas y tejido ancestral en palma de iraca.',
    category: 'cultura',
    municipalities: ['Usiacurí', 'Baranoa'],
    durationEstimate: '6 horas',
    distanceKm: 42,
    difficulty: 'Fácil',
    coverImageUrl: IMAGES.usiacuri.aerialMurales,
    placeIds: [
      'place_iglesia_santo_domingo',
      'place_casa_museo_julio_florez',
      'place_mirador_cristal',
      'place_centro_artesanal_iraca',
    ],
    avgRating: 4.9,
    reviewCount: 340,
    priceSuggested: 'Gratis / Autoguiado',
    highlights: [
      'Macromurales en techos en 360°',
      'Talleres de maestras de iraca',
      'Mirador de cristal en la montaña',
    ],
    tips: 'Lleva calzado cómodo para las escalinatas del mirador. Aceptan efectivo y transferencias en el centro artesanal.',
    createdAt: '2026-01-18T08:00:00Z',
  };

  // Get place objects for this route's stops
  const routePlaces = route.placeIds
    .map((id) => places.find((p) => p.id === id))
    .filter(Boolean);

  const isFav = isFavorite('route', route.id);

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: route.name,
        text: `Descubre esta ruta turística en el Atlántico: ${route.name}`,
        url: window.location.href,
      });
    } else {
      alert(`Enlace copiado al portapapeles: ${route.name}`);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-background pb-32">
      {/* Hero Media Cover */}
      <div className="relative h-72 w-full overflow-hidden">
        <img
          src={route.coverImageUrl}
          alt={route.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

        {/* Top Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <button
            onClick={goBack}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-on-surface shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-on-surface shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">share</span>
            </button>
            <button
              onClick={() => toggleFavorite('route', route.id)}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-primary shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}
              >
                favorite
              </span>
            </button>
          </div>
        </div>

        {/* Hero Title & Meta */}
        <div className="absolute bottom-4 left-4 right-4 text-white z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-primary-container text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
              {route.category}
            </span>
            <span className="text-[12px] text-[#FFD6A5] font-semibold">
              {route.municipalities.join(' • ')}
            </span>
          </div>
          <h1 className="text-headline-lg font-headline-lg font-extrabold text-white leading-tight drop-shadow-md">
            {route.name}
          </h1>
        </div>
      </div>

      {/* Main Body */}
      <div className="px-gutter-mobile space-y-5 pt-4 max-w-md mx-auto">
        {/* Quick Route Badges Bar */}
        <div className="grid grid-cols-4 gap-2 bg-white p-3 rounded-2xl shadow-sm border border-white/90 text-center">
          <div>
            <span className="material-symbols-outlined text-primary text-[20px]">schedule</span>
            <p className="text-[11px] text-on-surface-variant mt-0.5">Duración</p>
            <p className="text-label-sm font-bold text-on-surface">{route.durationEstimate}</p>
          </div>
          <div>
            <span className="material-symbols-outlined text-primary text-[20px]">straighten</span>
            <p className="text-[11px] text-on-surface-variant mt-0.5">Distancia</p>
            <p className="text-label-sm font-bold text-on-surface">{route.distanceKm} km</p>
          </div>
          <div>
            <span className="material-symbols-outlined text-primary text-[20px]">terrain</span>
            <p className="text-[11px] text-on-surface-variant mt-0.5">Dificultad</p>
            <p className="text-label-sm font-bold text-on-surface">{route.difficulty}</p>
          </div>
          <div>
            <span className="material-symbols-outlined text-[#FFC93C] text-[20px]">star</span>
            <p className="text-[11px] text-on-surface-variant mt-0.5">Calificación</p>
            <p className="text-label-sm font-bold text-on-surface">{route.avgRating.toFixed(1)}</p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h2 className="text-headline-sm font-headline-sm font-bold text-on-surface">
            Acerca de esta Ruta
          </h2>
          <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed">
            {route.description}
          </p>
        </div>

        {/* Highlights */}
        {route.highlights && route.highlights.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-label-lg font-bold text-on-surface">Lo Más Destacado</h3>
            <div className="space-y-1.5">
              {route.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-body-sm text-on-surface">
                  <span className="w-2 h-2 rounded-full bg-primary-container" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mascot Tip */}
        {route.tips && (
          <Card variant="ambient" rounded="2xl" padding="md" className="flex items-start gap-3">
            <div className="w-12 h-12 flex-shrink-0">
              <img
                src={IMAGES.mascot.iguanaTip}
                alt="Tip RutiGo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h4 className="text-label-sm font-bold text-primary flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">wb_sunny</span>
                Recomendación RutiGo
              </h4>
              <p className="text-body-sm text-on-surface mt-0.5">{route.tips}</p>
            </div>
          </Card>
        )}

        {/* Itinerary / Paradas */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-headline-sm font-headline-sm font-bold text-on-surface">
              Itinerario de Paradas ({routePlaces.length})
            </h3>
            <span className="text-label-sm text-primary font-bold">Orden sugerido</span>
          </div>

          <div className="relative border-l-2 border-primary/30 ml-4 pl-4 space-y-4">
            {routePlaces.map((place, idx) => {
              if (!place) return null;
              return (
                <div
                  key={place.id}
                  onClick={() => navigateTo('place_detail', { placeId: place.id })}
                  className="relative bg-white rounded-2xl p-3.5 shadow-sm border border-white/90 cursor-pointer hover:shadow-md transition-all active:scale-[0.99]"
                >
                  {/* Step Marker */}
                  <div className="absolute -left-[27px] top-4 w-6 h-6 rounded-full bg-primary-container text-white flex items-center justify-center text-[12px] font-bold ring-4 ring-background">
                    {idx + 1}
                  </div>

                  <div className="flex gap-3">
                    <img
                      src={place.images[0]}
                      alt={place.name}
                      className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-primary uppercase">
                            Parada {idx + 1}
                          </span>
                          <span className="text-[11px] text-on-surface-variant font-medium">
                            {place.estimatedTime || '45 min'}
                          </span>
                        </div>
                        <h4 className="text-label-md font-bold text-on-surface leading-snug mt-0.5 line-clamp-1">
                          {place.name}
                        </h4>
                        <p className="text-[12px] text-on-surface-variant line-clamp-1 mt-0.5">
                          {place.address || place.municipality}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <RatingStars rating={place.avgRating} showBadge />
                        <span className="text-[12px] font-bold text-primary flex items-center">
                          Ver lugar
                          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md px-gutter-mobile py-3.5 border-t border-[#E9DDD5] shadow-[0_-8px_20px_rgba(0,0,0,0.06)] flex items-center justify-between z-40">
        <div>
          <p className="text-[11px] text-on-surface-variant uppercase font-bold">Costo Estimado</p>
          <p className="text-label-lg font-bold text-on-surface">
            {route.priceSuggested || 'Gratis'}
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon="navigation"
          onClick={() => navigateTo('interactive_map', { routeId: route.id })}
        >
          Iniciar en Mapa
        </Button>
      </div>
    </div>
  );
};
