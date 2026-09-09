/**
 * 7. Search Screen
 * Quick search with live inputs, recent searches history management,
 * and quick discovery tags.
 */
import React, { useState } from 'react';
import { useApp } from '../store';
import { BottomNav } from '../components/BottomNav';
import { Chip } from '../components/Chip';

export const SearchScreen: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
    navigateTo,
    goBack,
  } = useApp();

  const [inputVal, setInputVal] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setSearchQuery(inputVal.trim());
    addRecentSearch(inputVal.trim());
    navigateTo('search_results');
  };

  const handleSelectTag = (tag: string) => {
    setInputVal(tag);
    setSearchQuery(tag);
    addRecentSearch(tag);
    navigateTo('search_results');
  };

  const popularTags = [
    { label: 'Macromurales Usiacurí', icon: 'palette' },
    { label: 'Muelle Histórico', icon: 'history_edu' },
    { label: 'Pastel de Pital', icon: 'lunch_dining' },
    { label: 'Castillo de Salgar', icon: 'castle' },
    { label: 'Campos de Girasoles', icon: 'filter_vintage' },
    { label: 'Senderos Piojó', icon: 'hiking' },
    { label: 'Artesanías en Iraca', icon: 'shopping_bag' },
  ];

  return (
    <div className="relative w-full min-h-screen bg-background pb-28">
      {/* Top Search Input Bar */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md px-gutter-mobile py-3 border-b border-[#E9DDD5]/60 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md mx-auto">
          <button
            type="button"
            onClick={goBack}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-on-surface hover:text-primary shadow-sm border border-white"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>

          <div className="flex-1 relative flex items-center">
            <span className="material-symbols-outlined absolute left-3.5 text-primary text-[20px]">
              search
            </span>
            <input
              type="text"
              autoFocus
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Buscar rutas, lugares o pueblos..."
              className="w-full h-11 pl-10 pr-10 rounded-full bg-white border border-[#E9DDD5] text-body-md text-on-surface shadow-[inset_0_2px_4px_rgba(46,41,56,0.04)] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            {inputVal && (
              <button
                type="button"
                onClick={() => setInputVal('')}
                className="absolute right-3 text-on-surface-variant hover:text-primary"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>

          <button
            type="submit"
            className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center shadow-md active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        </form>
      </header>

      <div className="px-gutter-mobile space-y-5 pt-4 max-w-md mx-auto">
        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-label-md font-bold text-on-surface flex items-center gap-1">
                <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
                  history
                </span>
                Búsquedas Recientes
              </span>
              <button
                onClick={clearRecentSearches}
                className="text-label-sm font-semibold text-primary hover:underline"
              >
                Borrar historial
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {recentSearches.map((term) => (
                <Chip
                  key={term}
                  label={term}
                  icon="history"
                  onClick={() => handleSelectTag(term)}
                  onClear={() => removeRecentSearch(term)}
                  size="sm"
                />
              ))}
            </div>
          </div>
        )}

        {/* Popular Atlántico Discovery Tags */}
        <div className="space-y-2.5">
          <span className="text-label-md font-bold text-on-surface px-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[#CA9A00] text-[18px]">
              trending_up
            </span>
            Lo Más Buscado en el Atlántico
          </span>

          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <button
                key={tag.label}
                onClick={() => handleSelectTag(tag.label)}
                className="h-9 px-3.5 rounded-full bg-white border border-[#E9DDD5] text-label-sm font-semibold text-on-surface shadow-xs hover:border-primary hover:text-primary flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-primary">
                  {tag.icon}
                </span>
                <span>{tag.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Explore by Category Quick Access */}
        <div className="space-y-2.5 pt-2">
          <span className="text-label-md font-bold text-on-surface px-1">
            Categorías Principales
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            <div
              onClick={() => {
                setSearchQuery('Cultura');
                navigateTo('explore_category', { category: 'cultura' });
              }}
              className="p-3 rounded-2xl bg-gradient-to-br from-[#F5F1FF] to-white border border-white shadow-sm flex items-center gap-2.5 cursor-pointer active:scale-95"
            >
              <div className="w-9 h-9 rounded-xl bg-[#7B61FF] text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">palette</span>
              </div>
              <div>
                <h4 className="text-label-sm font-bold text-on-surface">Cultura</h4>
                <p className="text-[11px] text-on-surface-variant">Artesanías y arte</p>
              </div>
            </div>

            <div
              onClick={() => {
                setSearchQuery('Gastronomía');
                navigateTo('explore_category', { category: 'gastronomia' });
              }}
              className="p-3 rounded-2xl bg-gradient-to-br from-[#FFF2ED] to-white border border-white shadow-sm flex items-center gap-2.5 cursor-pointer active:scale-95"
            >
              <div className="w-9 h-9 rounded-xl bg-primary-container text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">restaurant</span>
              </div>
              <div>
                <h4 className="text-label-sm font-bold text-on-surface">Gastronomía</h4>
                <p className="text-[11px] text-on-surface-variant">Sabores criollos</p>
              </div>
            </div>

            <div
              onClick={() => {
                setSearchQuery('Naturaleza');
                navigateTo('explore_category', { category: 'naturaleza' });
              }}
              className="p-3 rounded-2xl bg-gradient-to-br from-[#F0FBF4] to-white border border-white shadow-sm flex items-center gap-2.5 cursor-pointer active:scale-95"
            >
              <div className="w-9 h-9 rounded-xl bg-[#2ECC71] text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">forest</span>
              </div>
              <div>
                <h4 className="text-label-sm font-bold text-on-surface">Naturaleza</h4>
                <p className="text-[11px] text-on-surface-variant">Playas y miradores</p>
              </div>
            </div>

            <div
              onClick={() => {
                setSearchQuery('Historia');
                navigateTo('explore_category', { category: 'historia' });
              }}
              className="p-3 rounded-2xl bg-gradient-to-br from-[#FFFBEB] to-white border border-white shadow-sm flex items-center gap-2.5 cursor-pointer active:scale-95"
            >
              <div className="w-9 h-9 rounded-xl bg-[#CA9A00] text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">account_balance</span>
              </div>
              <div>
                <h4 className="text-label-sm font-bold text-on-surface">Historia</h4>
                <p className="text-[11px] text-on-surface-variant">Patrimonio vivo</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};
