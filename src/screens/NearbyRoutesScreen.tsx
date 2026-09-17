/**
 * 12. Nearby Routes Screen
 * Lists curated routes dynamically sorted by distance from current user GPS coordinates.
 */
import React from 'react';
import { useApp } from '../store';
import { TopAppBar } from '../components/TopAppBar';
import { BottomNav } from '../components/BottomNav';
import { Card } from '../components/Card';
import { RatingStars } from '../components/RatingStars';
import { calculateDistanceKm, formatDistance, estimateTravelTimes } from '../services/locationService';

export const NearbyRoutesScreen: React.FC = () => {
  const { routes, places, userLocation, navigateTo, goBack } = useApp();

  // Sort routes by distance to their first stop
  const routesWithDistance = routes.flatMap((route) => {
    const firstPlace = places.find((p) => p.id === route.placeIds[0]);
    if (!firstPlace) return [];
    const dist = calculateDistanceKm(userLocation, firstPlace.location);
    return [{
      ...route,
      distanceFromUser: dist,
      formattedDist: formatDistance(dist),
      travelEstimate: estimateTravelTimes(dist),
    }];
  });

  routesWithDistance.sort((a, b) => a.distanceFromUser - b.distanceFromUser);

  return (
    <div className="relative w-full min-h-screen bg-background pb-28">
      <TopAppBar
        title="Rutas Más Cercanas"
        subtitle="Calculado desde tu GPS"
        showBack={true}
        onBack={goBack}
      />

      <div className="px-gutter-mobile space-y-4 pt-3 max-w-md mx-auto">
        <div className="bg-primary-fixed/30 p-3.5 rounded-2xl flex items-center gap-3 border border-primary-fixed">
          <span className="material-symbols-outlined text-primary text-[24px]">explore</span>
          <p className="text-body-sm text-on-surface">
            Rutas turísticas ordenadas por cercanía geográfica al punto de inicio sugerido.
          </p>
        </div>

        <div className="space-y-3.5">
          {routesWithDistance.map((route) => (
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

                {/* Distance Badge */}
                <div className="absolute top-3 left-3 bg-primary-container text-white px-3 py-1 rounded-full text-[12px] font-bold shadow-md flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">navigation</span>
                  A {route.formattedDist} ({route.travelEstimate.drivingText})
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[11px] font-bold text-[#FFD6A5] uppercase">
                    {route.municipalities.join(' • ')}
                  </span>
                  <h4 className="text-headline-sm font-bold leading-tight line-clamp-1">
                    {route.name}
                  </h4>
                  <p className="text-[12px] text-white/90 mt-0.5">
                    {route.placeIds.length} paradas • {route.durationEstimate} • {route.difficulty}
                  </p>
                </div>
              </div>

              <div className="p-3.5 flex items-center justify-between">
                <RatingStars rating={route.avgRating} reviewCount={route.reviewCount} showBadge />
                <span className="text-label-sm font-bold text-primary flex items-center gap-1">
                  Iniciar ruta
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};
