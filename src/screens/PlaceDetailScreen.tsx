/**
 * 10. Place Detail Screen - Detalle de lugar
 * Tactile Claymorphic design with Caribbean aesthetic
 */
import React, { useState } from 'react';
import { useApp } from '../store';
import { calculateDistanceKm, formatDistance, estimateTravelTimes } from '../services/locationService';
import { AddReviewModal } from './AddReviewModal';

export const PlaceDetailScreen: React.FC = () => {
  const {
    selectedPlace,
    reviews,
    navigateTo,
    goBack,
    userLocation,
    toggleFavorite,
    isFavorite,
    currentUser,
  } = useApp();

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const place = selectedPlace;

  if (!place) {
    return <div className="w-full min-h-screen bg-mesh-caribbean p-6 text-center">Lugar no encontrado.</div>;
  }

  const isFav = isFavorite('place', place.id);

  // Distance calculations
  const distanceKm = calculateDistanceKm(userLocation, place.location);
  const distText = formatDistance(distanceKm);
  const { drivingText } = estimateTravelTimes(distanceKm);

  // Filter reviews for this place
  const placeReviews = reviews.filter((r) => r.placeId === place.id);

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: place.name,
        text: `Descubre ${place.name} en el Atlántico en RutiGo`,
        url: window.location.href,
      });
    } else {
      alert(`Enlace copiado al portapapeles: ${place.name}`);
    }
  };

  const categoryBadgeClass =
    place.category === 'cultura'
      ? 'clay-badge-cultura'
      : place.category === 'gastronomia'
      ? 'clay-badge-gastronomia'
      : place.category === 'historia'
      ? 'clay-badge-historia'
      : 'clay-badge-naturaleza';

  return (
    <div className="relative w-full min-h-screen bg-mesh-caribbean pb-32 text-on-surface overflow-x-hidden">
      {/* Top Floating Controls */}
      <header className="fixed top-0 left-0 right-0 z-40 max-w-md mx-auto px-5 pt-4 pb-2 flex items-center justify-between pointer-events-none">
        <button
          onClick={goBack}
          aria-label="Regresar"
          className="clay-button-circle w-11 h-11 flex items-center justify-center text-on-surface pointer-events-auto bg-white/90 backdrop-blur-md shadow-md cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </button>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={handleShare}
            aria-label="Compartir lugar"
            className="clay-button-circle w-11 h-11 flex items-center justify-center text-on-surface bg-white/90 backdrop-blur-md shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">share</span>
          </button>
          <button
            onClick={() => toggleFavorite('place', place.id)}
            aria-label="Guardar en favoritos"
            className="clay-button-circle w-11 h-11 flex items-center justify-center bg-white/90 backdrop-blur-md shadow-md cursor-pointer"
          >
            <span
              className={`material-symbols-outlined text-[22px] transition-colors ${
                isFav ? 'text-primary' : 'text-on-surface-variant'
              }`}
              style={{ fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </span>
          </button>
        </div>
      </header>

      {/* Hero Media Section */}
      <div className="relative w-full h-80 overflow-hidden shadow-lg">
        <img
          src={place.images?.[activePhotoIdx] || place.images?.[0]}
          alt={place.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30"></div>

        {/* Gallery Counter */}
        {place.images && place.images.length > 1 && (
          <div className="absolute top-16 right-5 bg-black/50 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">photo_camera</span>
            {activePhotoIdx + 1}/{place.images.length}
          </div>
        )}

        {/* Overlay Title & Category */}
        <div className="absolute bottom-5 left-5 right-5 text-white flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-white shadow-xs ${categoryBadgeClass}`}>
              {place.category}
            </span>
            <span className="text-[12px] text-white/90 font-semibold flex items-center gap-1 drop-shadow">
              <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                location_on
              </span>
              {place.municipality}, Atlántico
            </span>
          </div>

          <h1 className="text-[24px] font-extrabold leading-tight text-white drop-shadow-md">
            {place.name}
          </h1>
        </div>
      </div>

      {/* Gallery Mini Thumbnails Bar */}
      {place.images && place.images.length > 1 && (
        <div className="flex gap-2.5 px-5 py-3 overflow-x-auto no-scrollbar bg-surface/40 backdrop-blur-xs">
          {place.images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActivePhotoIdx(idx)}
              className={`w-14 h-14 rounded-2xl overflow-hidden shrink-0 transition-all border-2 cursor-pointer ${
                activePhotoIdx === idx
                  ? 'border-primary ring-2 ring-primary/40 scale-105 shadow-md'
                  : 'border-white/80 opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Main Content Body */}
      <main className="px-5 pt-4 flex flex-col gap-4">
        {/* Fast Stats Tactile Row */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Rating Pill */}
          <div className="clay-card p-3 rounded-[22px] flex flex-col items-center justify-center text-center">
            <div className="w-8 h-8 rounded-full clay-badge-yellow flex items-center justify-center text-white mb-1 shadow-xs">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
            </div>
            <span className="text-[14px] font-bold text-on-surface leading-tight">
              {place.avgRating.toFixed(1)}
            </span>
            <span className="text-[10px] text-outline">
              {place.reviewCount} reseñas
            </span>
          </div>

          {/* Distance Pill */}
          <div className="clay-card p-3 rounded-[22px] flex flex-col items-center justify-center text-center">
            <div className="w-8 h-8 rounded-full clay-badge-turquesa flex items-center justify-center text-white mb-1 shadow-xs">
              <span className="material-symbols-outlined text-[18px]">near_me</span>
            </div>
            <span className="text-[14px] font-bold text-secondary leading-tight">
              {distText}
            </span>
            <span className="text-[10px] text-outline">Desde tu punto</span>
          </div>

          {/* Driving Time Pill */}
          <div className="clay-card p-3 rounded-[22px] flex flex-col items-center justify-center text-center">
            <div className="w-8 h-8 rounded-full clay-badge-purple flex items-center justify-center text-white mb-1 shadow-xs">
              <span className="material-symbols-outlined text-[18px]">directions_car</span>
            </div>
            <span className="text-[14px] font-bold text-[#7E57C2] leading-tight">
              {drivingText}
            </span>
            <span className="text-[10px] text-outline">En vehículo</span>
          </div>
        </div>

        {/* Description Clay Card */}
        <section className="clay-card p-4 rounded-[26px] flex flex-col gap-2">
          <h2 className="text-[16px] font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">info</span>
            Sobre el lugar
          </h2>
          <p className="text-[14px] text-on-surface-variant leading-relaxed">
            {place.description}
          </p>
        </section>

        {/* Practical Information Clay Card */}
        <section className="clay-card p-4 rounded-[26px] flex flex-col gap-3">
          <h2 className="text-[16px] font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">explore</span>
            Información práctica
          </h2>

          <div className="flex flex-col gap-2.5 divide-y divide-surface-container-high/60">
            {/* Address */}
            <div className="flex items-center gap-3 pt-1">
              <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[18px]">pin_drop</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-outline font-semibold">Dirección / Acceso</span>
                <span className="text-[13px] font-medium text-on-surface">
                  {place.address || 'Tubará, Atlántico'}
                </span>
              </div>
            </div>

            {/* Schedule */}
            <div className="flex items-center gap-3 pt-2.5">
              <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined text-[18px]">schedule</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-outline font-semibold">Horario de visita</span>
                <span className="text-[13px] font-medium text-on-surface">
                  {place.schedule || 'Abierto todos los días de 8:00 AM a 5:00 PM'}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 pt-2.5">
              <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-[#4CAF50] shrink-0">
                <span className="material-symbols-outlined text-[18px]">payments</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-outline font-semibold">Tarifa sugerida</span>
                <span className="text-[13px] font-medium text-on-surface">
                  {place.priceNote || 'Acceso Libre'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Community Reviews Section */}
        <section className="flex flex-col gap-3 pt-1">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[16px] font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">rate_review</span>
              Reseñas de la comunidad ({placeReviews.length})
            </h2>
            <button
              onClick={() => {
                if (!currentUser) navigateTo('login');
                else setShowReviewModal(true);
              }}
              className="text-[13px] font-bold text-primary hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>+ Calificar</span>
            </button>
          </div>

          {placeReviews.length === 0 ? (
            <div className="clay-card p-5 rounded-[24px] text-center flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-outline text-[32px]">reviews</span>
              <p className="text-[13px] text-on-surface-variant font-medium">
                Aún no hay valoraciones para este rincón.
              </p>
              <button
                onClick={() => setShowReviewModal(true)}
                className="clay-chip-active text-white px-4 py-2 rounded-full text-[13px] font-bold mt-1 cursor-pointer"
              >
                Sé el primero en calificar
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {placeReviews.map((rev) => (
                <div key={rev.id} className="clay-card p-4 rounded-[24px] flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={
                          rev.userAvatar ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
                        }
                        alt={rev.userName}
                        className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-xs"
                      />
                      <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-on-surface leading-tight">
                          {rev.userName}
                        </span>
                        <span className="text-[11px] text-outline">
                          {new Date(rev.createdAt).toLocaleDateString('es-CO', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Star Rating Badge */}
                    <div className="clay-badge-yellow px-2.5 py-1 rounded-full text-white text-[12px] font-extrabold flex items-center gap-1 shadow-xs">
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span>{rev.rating}.0</span>
                    </div>
                  </div>

                  <p className="text-[13px] text-on-surface-variant leading-relaxed">
                    {rev.comment}
                  </p>

                  {rev.photoUrl && (
                    <div className="w-full h-36 rounded-2xl overflow-hidden mt-1 shadow-xs border border-white">
                      <img src={rev.photoUrl} alt="Foto de viajero" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Floating Bottom Sticky Action Bar */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-surface/90 backdrop-blur-md px-5 py-3.5 border-t border-white/80 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] flex items-center gap-3 z-40">
        <button
          onClick={() => {
            if (!currentUser) navigateTo('login');
            else setShowReviewModal(true);
          }}
          className="clay-button-secondary py-3 px-4 rounded-full flex-1 flex items-center justify-center gap-2 text-primary font-bold text-[14px] cursor-pointer active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[18px]">rate_review</span>
          <span>Valorar</span>
        </button>

        <button
          onClick={() => navigateTo('interactive_map', { placeId: place.id })}
          className="clay-button-primary py-3 px-4 rounded-full flex-1 flex items-center justify-center gap-2 text-white font-bold text-[14px] cursor-pointer active:scale-95 transition-transform shadow-md"
        >
          <span className="material-symbols-outlined text-[18px]">map</span>
          <span>Ver en Mapa</span>
        </button>
      </footer>

      {/* Review Modal */}
      {showReviewModal && (
        <AddReviewModal placeId={place.id} onClose={() => setShowReviewModal(false)} />
      )}
    </div>
  );
};

