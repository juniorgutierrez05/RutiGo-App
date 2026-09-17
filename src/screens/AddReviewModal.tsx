/**
 * 14. Add Review Modal Component - Calificar experiencia
 * Exact Tactile Claymorphism matching user design
 */
import React, { useState } from 'react';
import { useApp } from '../store';

interface AddReviewModalProps {
  placeId: string;
  onClose: () => void;
}

export const AddReviewModal: React.FC<AddReviewModalProps> = ({ placeId, onClose }) => {
  const { addReview, places } = useApp();
  const currentPlace = places.find((p) => p.id === placeId);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [recommend, setRecommend] = useState<boolean>(true);
  const [activeHighlights, setActiveHighlights] = useState<string[]>([
    'Hermosos paisajes',
    'Agua refrescante',
    'Ruta segura',
  ]);
  const [photos, setPhotos] = useState<string[]>([
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCVtjmV-x80Z8itKsjtVh49L1z5Qv8-6ZBGoMj2Lxb-rjXmwuLBYQbWKQi-GbnOQ7NHRvcLXQa4IK6hmwzz2sQyVkC5ms9ZM-KWJb3ab4V8R45n-UOp8_Lzl9fcbbTObbxNLS2gOv16FYfBcSZnHHAuN_yN_AObDRvx18g6eNC5ppAXOgHZilakQjA3dE9cOuxP1i3zKNpc9fjPjUrCU-gHxHSz3Rzrn8BkSuD3ez-ffgr53mOXdAL3',
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const highlightsOptions = [
    { label: 'Hermosos paisajes', icon: 'nature_people' },
    { label: 'Agua refrescante', icon: 'water_drop' },
    { label: 'Guías amables', icon: 'badge' },
    { label: 'Comida local rica', icon: 'restaurant' },
    { label: 'Ruta segura', icon: 'verified_user' },
  ];

  const ratingFeedbackMap: Record<number, string> = {
    1: 'Insatisfactorio (1/5) 😔',
    2: 'Podría mejorar (2/5) 🌿',
    3: 'Buena experiencia (3/5) 👍',
    4: '¡Muy recomendado! (4/5) ⭐',
    5: '¡Increíble experiencia! (5/5) ✨',
  };

  const toggleHighlight = (item: string) => {
    if (activeHighlights.includes(item)) {
      setActiveHighlights(activeHighlights.filter((h) => h !== item));
    } else {
      setActiveHighlights([...activeHighlights, item]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && photos.length < 4) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos([...photos, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      const textToSubmit = comment.trim() || '¡Excelente visita en el Atlántico!';
      await addReview(placeId, rating, textToSubmit, photos[0]);
      onClose();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo publicar la reseña.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentPlace) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-5">
        <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl">
          <p className="font-bold text-on-surface">Lugar no encontrado.</p>
          <button type="button" onClick={onClose} className="mt-4 rounded-full bg-primary px-5 py-2 font-bold text-white">Cerrar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-[400px] min-h-screen sm:min-h-0 sm:max-h-[95vh] sm:rounded-[36px] bg-gradient-to-b from-[#FFF5EF] via-[#FEF7FF] to-[#FFF0EB] flex flex-col relative pb-8 overflow-y-auto no-scrollbar shadow-2xl border border-white/80">
        {/* Top Decorative Tropical Glow Orb */}
        <div className="absolute -top-16 -right-16 w-52 h-52 bg-primary-container/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-60 -left-16 w-52 h-52 bg-secondary-container/25 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top App Bar */}
        <header className="w-full px-5 pt-4 pb-2 flex items-center justify-between z-20">
          <button
            onClick={onClose}
            aria-label="Cerrar y cancelar valoración"
            className="w-11 h-11 rounded-full bg-white clay-button-circle flex items-center justify-center text-on-surface active:scale-90 transition-transform duration-150 ease-out border border-white cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>

          <h1 className="text-[18px] font-bold text-on-surface tracking-tight text-center">
            Calificar experiencia
          </h1>

          <button
            onClick={() => alert('Comparte tu opinión sincera para ayudar a otros turistas')}
            aria-label="Ayuda"
            className="w-11 h-11 rounded-full bg-white/70 clay-button-circle flex items-center justify-center text-on-surface-variant active:scale-90 transition-transform duration-150 ease-out border border-white cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">help_outline</span>
          </button>
        </header>

        {/* Scrollable Flow Container */}
        <form onSubmit={handleSubmit} className="px-5 flex flex-col gap-4 mt-2 z-10">
          {errorMessage && (
            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}
          {/* Context Place Card (Miniature Clay Capsule) */}
          <section className="clay-card rounded-[24px] p-3 flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-[18px] overflow-hidden shrink-0 shadow-md border-2 border-white">
              <img
                className="w-full h-full object-cover"
                alt={currentPlace.name}
                src={
                  currentPlace.images?.[0] ||
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuCJJw5Z8cg30pkAQ5M0Vk3vwoiYzN3FWU99r49j_2MjhQqR6got53Wa6UIOQQhJn6j2pIXQzqhUHRa9ksve3osFKYs14WYxngLnY4k6gm7K83lO6F2YD4lPJ8i-GkIPtIWL1K7S9RxjT6FmaCa6GTR4olYMQprOOsAlVwNkLMLAExNddcF9HKnc0k3SIK6-E4tMnGaWOOwoUDfoO19mnLnJ17NlUeGXM40OJmrEaAPQaPcw7a1q0xfv'
                }
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
            </div>
            <div className="flex flex-col pr-1">
              <span className="text-[11px] text-secondary tracking-wider uppercase font-extrabold flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  location_on
                </span>
                {currentPlace.municipality || 'Tubará'}, Atlántico
              </span>
              <h2 className="text-[15px] font-bold text-on-surface leading-tight mt-0.5">
                ¿Qué te pareció {currentPlace.name}?
              </h2>
            </div>
          </section>

          {/* Interactive 3D Rating Selector */}
          <section className="clay-card rounded-[28px] p-4 flex flex-col items-center text-center">
            <span className="text-[13px] font-semibold text-on-surface-variant mb-2">
              Toca para calificar tu paseo
            </span>

            {/* 5 Volumetric 3D Stars Row */}
            <div className="flex items-center justify-center gap-2.5 my-1" role="radiogroup">
              {[1, 2, 3, 4, 5].map((starNum) => (
                <button
                  key={starNum}
                  type="button"
                  onClick={() => setRating(starNum)}
                  className={`w-12 h-12 rounded-[18px] flex items-center justify-center text-white active:scale-90 transition-all duration-200 cursor-pointer ${
                    rating >= starNum
                      ? 'clay-star-active ring-2 ring-[#FFC93C]/40 ring-offset-2'
                      : 'clay-star-inactive'
                  }`}
                  aria-label={`${starNum} estrellas`}
                >
                  <span
                    className="material-symbols-outlined text-[28px] drop-shadow-sm"
                    style={{ fontVariationSettings: rating >= starNum ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    grade
                  </span>
                </button>
              ))}
            </div>

            {/* Dynamic Feedback Pill */}
            <div className="mt-3 bg-surface-container-low px-4 py-1.5 rounded-full border border-primary-fixed flex items-center gap-1.5 shadow-sm">
              <span className="text-[13px] text-primary font-bold">
                {ratingFeedbackMap[rating] || '¡Increíble experiencia! (5/5) ✨'}
              </span>
            </div>
          </section>

          {/* Highlights Selection (Chips) */}
          <section className="flex flex-col gap-2">
            <h3 className="text-[15px] font-bold text-on-surface px-1">
              ¿Qué destacarías de tu visita?
            </h3>
            <div className="flex flex-wrap gap-2">
              {highlightsOptions.map((item) => {
                const isActive = activeHighlights.includes(item.label);
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => toggleHighlight(item.label)}
                    className={`px-3.5 py-2 rounded-full text-[13px] font-semibold flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer ${
                      isActive ? 'clay-chip-active text-white' : 'clay-chip-inactive text-on-surface-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Textarea Review Section */}
          <section className="clay-card rounded-[28px] p-4 flex flex-col gap-2">
            <label className="text-[14px] font-bold text-on-surface flex justify-between items-center" htmlFor="review-text">
              <span>Tu opinión detallada</span>
              <span className="text-[12px] text-outline font-normal">Opcional</span>
            </label>
            <div className="clay-surface-sunken rounded-[20px] p-3 relative">
              <textarea
                id="review-text"
                value={comment}
                onChange={(e) => setComment(e.target.value.slice(0, 400))}
                className="w-full bg-transparent border-none p-0 text-on-surface text-[14px] focus:ring-0 focus:outline-none resize-none placeholder:text-outline-variant placeholder:text-[13px]"
                placeholder="Cuéntanos qué fue lo más mágico de tu recorrido, consejos para otros viajeros..."
                rows={3}
              />
              <div className="flex justify-end mt-1">
                <span className="text-[11px] text-outline-variant font-medium">
                  {comment.length}/400
                </span>
              </div>
            </div>
          </section>

          {/* Photos Upload Section */}
          <section className="clay-card rounded-[28px] p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-[15px] font-bold text-on-surface">
                Fotos de tu viaje
              </h3>
              <span className="text-[12px] text-secondary font-bold">
                {photos.length} / 4 fotos
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-1">
              {/* Uploaded Photo Preview with Soft 3D Clay Badge Delete */}
              {photos.map((photo, idx) => (
                <div key={idx} className="relative h-28 rounded-[20px] overflow-hidden shadow-sm border-2 border-white group">
                  <img
                    className="w-full h-full object-cover"
                    alt={`Foto ${idx + 1}`}
                    src={photo}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  <button
                    onClick={() => removePhoto(idx)}
                    aria-label="Eliminar foto"
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md text-error flex items-center justify-center shadow-md active:scale-90 transition-transform cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                  <span className="absolute bottom-2 left-2.5 text-white text-[11px] font-bold drop-shadow">
                    Cascada_0{idx + 1}.jpg
                  </span>
                </div>
              ))}

              {/* Add Photo CTA Button */}
              {photos.length < 4 && (
                <label className="h-28 rounded-[20px] border-2 border-dashed border-primary-container/60 bg-[#FFF9F6] flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform hover:bg-[#FFF2EB] cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-container to-[#FFA585] text-white flex items-center justify-center shadow-md shadow-primary-container/30">
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      photo_camera
                    </span>
                  </div>
                  <span className="text-[12px] text-primary font-bold">
                    Agregar fotos
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </section>

          {/* Recommendation Pill Selector */}
          <section className="clay-card rounded-[24px] p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-on-surface leading-snug">
                ¿Recomendarías este lugar?
              </span>
              <span className="text-[12px] text-on-surface-variant">
                Para la comunidad RutiGo
              </span>
            </div>

            <div className="flex items-center gap-2" role="radiogroup">
              {/* Pill Sí */}
              <button
                type="button"
                onClick={() => setRecommend(true)}
                className={`px-4 py-2 rounded-full text-[13px] font-bold flex items-center gap-1.5 active:scale-95 transition-transform cursor-pointer ${
                  recommend ? 'clay-pill-selected-yes text-white' : 'clay-chip-inactive text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: recommend ? "'FILL' 1" : "'FILL' 0" }}>
                  thumb_up
                </span>
                Sí
              </button>

              {/* Pill No */}
              <button
                type="button"
                onClick={() => setRecommend(false)}
                className={`px-3.5 py-2 rounded-full text-[13px] font-bold flex items-center gap-1.5 active:scale-95 transition-transform cursor-pointer ${
                  !recommend ? 'clay-pill-selected text-white' : 'clay-chip-inactive text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">thumb_down</span>
                No
              </button>
            </div>
          </section>

          {/* Primary Submit Action Button */}
          <div className="pt-2 pb-2 flex flex-col gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[54px] rounded-full clay-btn-coral text-white font-bold text-[16px] tracking-wide flex items-center justify-center gap-2 active:scale-95 transition-all duration-150 ease-out cursor-pointer shadow-lg"
            >
              <span>{isSubmitting ? 'Publicando...' : 'Publicar reseña'}</span>
              <span className="material-symbols-outlined text-[20px]">send</span>
            </button>
            <p className="text-center text-[12px] text-outline">
              Ganas <strong className="text-primary font-bold">+50 puntos</strong> de explorador Caribe 🌴
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

