/**
 * 11. Interactive Map Screen - Mapa Turístico Atlántico
 * Atlántico interactive geographic map featuring 3D clay pins, category filters,
 * live GPS positioning beacon, and claymorphic dynamic bottom place card.
 */
import React, { useState } from 'react';
import { useApp } from '../store';
import { BottomNav } from '../components/BottomNav';
import { calculateDistanceKm, formatDistance, estimateTravelTimes, ATLANTICO_MUNICIPALITIES } from '../services/locationService';
import { Place, CategoryType } from '../types';

export const InteractiveMapScreen: React.FC = () => {
  const {
    places,
    selectedPlace,
    navigateTo,
    userLocation,
    refreshLocation,
  } = useApp();

  const [activePlace, setActivePlace] = useState<Place>(selectedPlace || places[0]);
  const [mapCategory, setMapCategory] = useState<CategoryType | 'todas'>('todas');
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('Todos');

  // Filter markers
  const visiblePlaces = places.filter((p) => {
    const matchCat = mapCategory === 'todas' || p.category === mapCategory;
    const matchMuni =
      selectedMunicipality === 'Todos' || p.municipality === selectedMunicipality;
    return matchCat && matchMuni;
  });

  // Calculate distance & time for active selected place
  const distKm = calculateDistanceKm(userLocation, activePlace.location);
  const distText = formatDistance(distKm);
  const { drivingText } = estimateTravelTimes(distKm);

  // Approximate relative CSS positioning on our Atlántico vector map
  const getMapCoordinates = (lat: number, lng: number) => {
    const minLat = 10.60;
    const maxLat = 11.12;
    const minLng = -75.18;
    const maxLng = -74.74;

    const top = 100 - ((lat - minLat) / (maxLat - minLat)) * 82 - 8;
    const left = ((lng - minLng) / (maxLng - minLng)) * 82 + 8;

    return {
      top: `${Math.min(92, Math.max(8, top))}%`,
      left: `${Math.min(92, Math.max(8, left))}%`,
    };
  };

  const getPinColor = (cat: CategoryType) => {
    switch (cat) {
      case 'cultura':
        return 'clay-badge-cultura shadow-[0_8px_16px_rgba(123,97,255,0.45)]';
      case 'gastronomia':
        return 'clay-badge-gastronomia shadow-[0_8px_16px_rgba(255,107,74,0.45)]';
      case 'naturaleza':
        return 'clay-badge-naturaleza shadow-[0_8px_16px_rgba(30,174,152,0.45)]';
      case 'historia':
        return 'clay-badge-historia shadow-[0_8px_16px_rgba(230,126,34,0.45)]';
    }
  };

  const getPinIcon = (cat: CategoryType) => {
    switch (cat) {
      case 'cultura':
        return 'palette';
      case 'gastronomia':
        return 'restaurant';
      case 'naturaleza':
        return 'forest';
      case 'historia':
        return 'account_balance';
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#DDE9F0] overflow-hidden select-none">
      {/* Top Floating Controls */}
      <header className="absolute top-0 left-0 right-0 z-30 max-w-md mx-auto p-4 space-y-2 pointer-events-none">
        {/* Search & Location Bar */}
        <div className="clay-card rounded-full px-4 py-2.5 shadow-md flex items-center justify-between border-2 border-white pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">explore</span>
            <div>
              <p className="text-[13px] font-bold text-on-surface">Mapa Turístico Atlántico</p>
              <p className="text-[11px] text-on-surface-variant font-medium">
                {visiblePlaces.length} puntos turísticos
              </p>
            </div>
          </div>

          {/* Municipality Selector Dropdown */}
          <select
            value={selectedMunicipality}
            onChange={(e) => setSelectedMunicipality(e.target.value)}
            className="text-[12px] font-bold text-primary clay-pill-selector px-3 py-1 rounded-full border-none focus:outline-none cursor-pointer"
          >
            <option value="Todos">Todo Atlántico</option>
            {Object.keys(ATLANTICO_MUNICIPALITIES).map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar pointer-events-auto">
          {(['todas', 'cultura', 'gastronomia', 'naturaleza', 'historia'] as const).map((cat) => {
            const isSelected = mapCategory === cat;
            const labels = {
              todas: 'Todos',
              cultura: 'Cultura',
              gastronomia: 'Sabor',
              naturaleza: 'Naturaleza',
              historia: 'Historia',
            };
            return (
              <button
                key={cat}
                onClick={() => setMapCategory(cat)}
                className={`h-9 px-4 rounded-full text-[12px] font-bold whitespace-nowrap transition-all shadow-xs active:scale-95 cursor-pointer ${
                  isSelected
                    ? 'clay-btn-coral text-white shadow-md'
                    : 'clay-card text-on-surface hover:text-primary'
                }`}
              >
                {labels[cat]}
              </button>
            );
          })}
        </div>
      </header>

      {/* Styled Interactive Geographic Map Surface */}
      <div className="relative w-full h-full">
        {/* Ocean Background & Coastline Curve Simulation */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#CDE6F5] to-[#BFE0F2]" />

        {/* Landmass of Atlántico Department */}
        <div
          className="absolute inset-0 m-auto w-[94%] h-[92%] bg-gradient-to-br from-[#F7F2EB] via-[#F3EDE3] to-[#EBE2D5] rounded-[60px] shadow-inner border-[3px] border-[#D6C4AD]/60 overflow-hidden"
          style={{
            clipPath:
              'polygon(15% 10%, 45% 8%, 78% 12%, 92% 35%, 88% 70%, 75% 92%, 40% 95%, 18% 85%, 8% 55%)',
          }}
        >
          {/* Subtle topography and river lines */}
          <svg className="absolute inset-0 w-full h-full opacity-35 pointer-events-none">
            {/* Río Magdalena East border */}
            <path
              d="M 280,30 Q 320,150 310,260 T 330,420 T 320,600"
              fill="none"
              stroke="#00C2CB"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Vía al Mar highway */}
            <path
              d="M 120,80 Q 180,110 240,140 T 290,210"
              fill="none"
              stroke="#FF7A59"
              strokeWidth="4"
              strokeDasharray="6 4"
            />
            {/* Cordillera de Piojó elevation rings */}
            <circle cx="110" cy="380" r="50" fill="#E4D5BE" opacity="0.4" />
            <circle cx="110" cy="380" r="30" fill="#D8C5A8" opacity="0.4" />
            <circle cx="180" cy="450" r="60" fill="#E4D5BE" opacity="0.3" />
          </svg>

          {/* Department Region Labels */}
          <div className="absolute top-[18%] right-[16%] text-on-surface-variant font-black text-[11px] tracking-widest opacity-60 uppercase">
            Barranquilla
          </div>
          <div className="absolute top-[14%] left-[26%] text-on-surface-variant font-black text-[11px] tracking-widest opacity-60 uppercase">
            Pto. Colombia
          </div>
          <div className="absolute top-[52%] left-[34%] text-on-surface-variant font-black text-[11px] tracking-widest opacity-60 uppercase">
            Usiacurí
          </div>
          <div className="absolute top-[44%] left-[54%] text-on-surface-variant font-black text-[11px] tracking-widest opacity-60 uppercase">
            Baranoa
          </div>
          <div className="absolute top-[58%] left-[16%] text-on-surface-variant font-black text-[11px] tracking-widest opacity-60 uppercase">
            Piojó
          </div>
        </div>

        {/* User GPS Location Beacon */}
        <div
          className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          style={getMapCoordinates(userLocation.lat, userLocation.lng)}
        >
          <div className="relative flex items-center justify-center">
            <span className="absolute w-8 h-8 rounded-full bg-[#00C2CB]/30 animate-ping" />
            <span className="w-5 h-5 rounded-full bg-[#00C2CB] border-2 border-white shadow-md flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-white" />
            </span>
          </div>
        </div>

        {/* 3D Clay Place Pins */}
        {visiblePlaces.map((place) => {
          const coords = getMapCoordinates(place.location.lat, place.location.lng);
          const isSelected = activePlace.id === place.id;

          return (
            <div
              key={place.id}
              onClick={() => setActivePlace(place)}
              className="absolute z-25 transform -translate-x-1/2 -translate-y-full cursor-pointer transition-all duration-200 hover:scale-125"
              style={coords}
            >
              <div
                className={`relative flex flex-col items-center group ${
                  isSelected ? 'scale-125 z-30' : ''
                }`}
              >
                {/* 3D Pin Head */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-white text-white transition-all ${getPinColor(
                    place.category
                  )}`}
                >
                  <span
                    className="material-symbols-outlined text-[19px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {getPinIcon(place.category)}
                  </span>
                </div>

                {/* Pin Tip */}
                <div
                  className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-white -mt-0.5"
                />

                {/* Selected Indicator Glow */}
                {isSelected && (
                  <span className="absolute -bottom-2 w-3.5 h-1.5 bg-black/40 rounded-full blur-xs" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Action Tool Buttons */}
      <div className="absolute right-4 bottom-52 z-30 flex flex-col gap-2.5">
        <button
          onClick={refreshLocation}
          title="Centrar en mi ubicación"
          className="clay-button-circle w-12 h-12 flex items-center justify-center text-on-surface hover:text-primary active:scale-90 transition-all cursor-pointer shadow-md"
        >
          <span className="material-symbols-outlined text-[22px]">my_location</span>
        </button>

        <button
          onClick={() => navigateTo('nearby_routes')}
          title="Ver rutas cercanas"
          className="w-12 h-12 rounded-full clay-badge-coral text-white shadow-md flex items-center justify-center active:scale-90 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">alt_route</span>
        </button>
      </div>

      {/* Bottom Floating Place Summary Card */}
      {activePlace && (
        <div className="absolute bottom-20 left-0 right-0 z-30 max-w-md mx-auto px-4">
          <div
            onClick={() => navigateTo('place_detail', { placeId: activePlace.id })}
            className="clay-card rounded-[28px] p-3.5 flex gap-3.5 cursor-pointer active:scale-[0.99] transition-all shadow-xl"
          >
            <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border-2 border-white shadow-xs relative">
              <img
                src={activePlace.images[0]}
                alt={activePlace.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 flex flex-col justify-between py-0.5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-primary uppercase tracking-wide">
                    {activePlace.municipality}
                  </span>
                  <span className="text-[11px] font-semibold text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-primary">
                      navigation
                    </span>
                    {distText} • {drivingText}
                  </span>
                </div>
                <h3 className="text-[14px] font-bold text-on-surface leading-tight line-clamp-1 mt-0.5">
                  {activePlace.name}
                </h3>
                <p className="text-[12px] text-on-surface-variant line-clamp-1 mt-0.5">
                  {activePlace.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1 text-[12px] font-bold text-[#FF9800]">
                  <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  <span>{activePlace.avgRating.toFixed(1)}</span>
                  <span className="text-outline font-normal">({activePlace.reviewCount})</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateTo('place_detail', { placeId: activePlace.id });
                  }}
                  className="clay-button-primary px-3.5 py-1.5 rounded-full text-white text-[12px] font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <span>Explorar</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

