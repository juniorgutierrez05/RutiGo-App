/**
 * 13. Reviews Screen
 * Lists authentic traveler reviews across Atlántico spots with CRUD operations.
 */
import React, { useState } from 'react';
import { useApp } from '../store';
import { TopAppBar } from '../components/TopAppBar';
import { BottomNav } from '../components/BottomNav';
import { RatingStars } from '../components/RatingStars';
import { Button } from '../components/Button';
import { AddReviewModal } from './AddReviewModal';

export const ReviewsScreen: React.FC = () => {
  const { reviews, places, currentUser, deleteReview, navigateTo, goBack } = useApp();
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredReviews =
    selectedPlaceId === 'all'
      ? reviews
      : reviews.filter((r) => r.placeId === selectedPlaceId);

  return (
    <div className="relative w-full min-h-screen bg-background pb-28">
      <TopAppBar
        title="Comunidad & Reseñas"
        subtitle="Experiencias reales en el Atlántico"
        showBack={true}
        onBack={goBack}
      />

      <div className="px-gutter-mobile space-y-4 pt-3 max-w-md mx-auto">
        {/* Place Selector Filter */}
        <div className="flex items-center justify-between">
          <label className="text-label-sm font-bold text-on-surface">Filtrar por lugar:</label>
          <select
            value={selectedPlaceId}
            onChange={(e) => setSelectedPlaceId(e.target.value)}
            className="text-label-sm font-bold text-primary bg-white border border-[#E9DDD5] px-3 py-1.5 rounded-full focus:outline-none"
          >
            <option value="all">Todos los lugares</option>
            {places.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.municipality})
              </option>
            ))}
          </select>
        </div>

        {/* Reviews List */}
        <div className="space-y-3">
          {filteredReviews.map((rev) => {
            const place = places.find((p) => p.id === rev.placeId);
            const isAuthor = currentUser && currentUser.id === rev.userId;

            return (
              <div
                key={rev.id}
                className="bg-white p-4 rounded-2xl shadow-sm border border-white/90 space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={
                        rev.userAvatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
                      }
                      alt={rev.userName}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-primary/20"
                    />
                    <div>
                      <p className="text-label-md font-bold text-on-surface">{rev.userName}</p>
                      {place && (
                        <p
                          onClick={() => navigateTo('place_detail', { placeId: place.id })}
                          className="text-[12px] text-primary font-bold hover:underline cursor-pointer"
                        >
                          {place.name} • {place.municipality}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <RatingStars rating={rev.rating} size="sm" />
                    <span className="text-[11px] text-outline mt-0.5">
                      {new Date(rev.createdAt).toLocaleDateString('es-CO', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  {rev.comment}
                </p>

                {rev.photoUrl && (
                  <img
                    src={rev.photoUrl}
                    alt="Foto del viajero"
                    className="w-full h-44 object-cover rounded-xl mt-1"
                  />
                )}

                {isAuthor && (
                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() => deleteReview(rev.id)}
                      className="text-[12px] font-bold text-error flex items-center gap-1 hover:underline"
                    >
                      <span className="material-symbols-outlined text-[15px]">delete</span>
                      Eliminar mi reseña
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Floating Add Review Button */}
        <div className="pt-2">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            icon="rate_review"
            onClick={() => {
              if (!currentUser) navigateTo('login');
              else setShowAddModal(true);
            }}
          >
            Escribir una Valoración
          </Button>
        </div>
      </div>

      {showAddModal && (
        <AddReviewModal
          placeId={selectedPlaceId === 'all' ? places[0].id : selectedPlaceId}
          onClose={() => setShowAddModal(false)}
        />
      )}

      <BottomNav />
    </div>
  );
};
