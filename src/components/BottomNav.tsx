/**
 * BottomNav Component
 * Floating soft clay capsule bottom navigation bar with 5 primary destinations:
 * Inicio | Explorar | Mapa | Guardados | Perfil
 */
import React from 'react';
import { useApp } from '../store';

export const BottomNav: React.FC = () => {
  const { currentScreen, navigateTo } = useApp();

  // Determine active tab
  const getActiveTab = (): 'home' | 'explore' | 'map' | 'saved' | 'profile' => {
    switch (currentScreen) {
      case 'home':
        return 'home';
      case 'explore_category':
      case 'search':
      case 'search_results':
      case 'recommendations':
        return 'explore';
      case 'interactive_map':
      case 'nearby_routes':
        return 'map';
      case 'favorites':
        return 'saved';
      case 'profile':
      case 'settings':
        return 'profile';
      default:
        return 'home';
    }
  };

  const active = getActiveTab();

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto z-50 px-4 pb-3 flex justify-around items-center pointer-events-none"
    >
      <div className="w-full clay-card rounded-full h-[68px] flex items-center justify-around px-2 border-2 border-white pointer-events-auto shadow-2xl">
        {/* Tab 1: Inicio */}
        <button
          onClick={() => navigateTo('home')}
          className={`flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
            active === 'home'
              ? 'clay-btn-coral text-white rounded-full px-4 py-1.5 shadow-md scale-105'
              : 'text-on-surface-variant hover:text-primary px-2 py-1 active:scale-90'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: active === 'home' ? "'FILL' 1" : "'FILL' 0" }}
          >
            explore
          </span>
          <span className="text-[11px] font-bold">Inicio</span>
        </button>

        {/* Tab 2: Explorar */}
        <button
          onClick={() => navigateTo('explore_category')}
          className={`flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
            active === 'explore'
              ? 'clay-btn-coral text-white rounded-full px-4 py-1.5 shadow-md scale-105'
              : 'text-on-surface-variant hover:text-primary px-2 py-1 active:scale-90'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: active === 'explore' ? "'FILL' 1" : "'FILL' 0" }}
          >
            travel_explore
          </span>
          <span className="text-[11px] font-bold">Explorar</span>
        </button>

        {/* Tab 3: Mapa */}
        <button
          onClick={() => navigateTo('interactive_map')}
          className={`flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
            active === 'map'
              ? 'clay-btn-coral text-white rounded-full px-4 py-1.5 shadow-md scale-105'
              : 'text-on-surface-variant hover:text-primary px-2 py-1 active:scale-90'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: active === 'map' ? "'FILL' 1" : "'FILL' 0" }}
          >
            map
          </span>
          <span className="text-[11px] font-bold">Mapa</span>
        </button>

        {/* Tab 4: Guardados */}
        <button
          onClick={() => navigateTo('favorites')}
          className={`flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
            active === 'saved'
              ? 'clay-btn-coral text-white rounded-full px-4 py-1.5 shadow-md scale-105'
              : 'text-on-surface-variant hover:text-primary px-2 py-1 active:scale-90'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: active === 'saved' ? "'FILL' 1" : "'FILL' 0" }}
          >
            bookmark
          </span>
          <span className="text-[11px] font-bold">Guardados</span>
        </button>

        {/* Tab 5: Perfil */}
        <button
          onClick={() => navigateTo('profile')}
          className={`flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
            active === 'profile'
              ? 'clay-btn-coral text-white rounded-full px-4 py-1.5 shadow-md scale-105'
              : 'text-on-surface-variant hover:text-primary px-2 py-1 active:scale-90'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: active === 'profile' ? "'FILL' 1" : "'FILL' 0" }}
          >
            person
          </span>
          <span className="text-[11px] font-bold">Perfil</span>
        </button>
      </div>
    </nav>
  );
};

