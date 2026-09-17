/**
 * 16. Profile Screen - Mi Perfil
 * Tactile Claymorphism user dashboard with explorer badges, stats, and shortcuts
 */
import React from 'react';
import { useApp } from '../store';
import { BottomNav } from '../components/BottomNav';
import { IMAGES } from '../assets/images';

export const ProfileScreen: React.FC = () => {
  const { currentUser, logout, navigateTo, goBack } = useApp();

  if (!currentUser) {
    return <div className="w-full min-h-screen bg-mesh-caribbean p-6 text-center">Inicia sesión para ver tu perfil.</div>;
  }

  const user = currentUser;

  const badges = [
    { id: 'b1', name: 'Artesano', desc: 'Usiacurí', icon: 'palette', color: 'clay-badge-cultura' },
    { id: 'b2', name: 'Costeño Pro', desc: 'Puerto Col.', icon: 'sailing', color: 'clay-badge-naturaleza' },
    { id: 'b3', name: 'Gourmet', desc: 'Butifarra', icon: 'restaurant', color: 'clay-badge-gastronomia' },
    { id: 'b4', name: 'Historiador', desc: 'Bocas de Ceniza', icon: 'account_balance', color: 'clay-badge-historia' },
  ];

  return (
    <div className="w-full min-h-screen bg-mesh-caribbean flex flex-col relative pb-28 overflow-x-hidden text-on-surface">
      {/* TOP APP BAR */}
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md px-5 pt-4 pb-3 flex justify-between items-center w-full shadow-sm">
        <button
          onClick={goBack}
          aria-label="Regresar"
          className="clay-button-circle w-11 h-11 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </button>

        <div className="flex flex-col items-center">
          <h1 className="font-headline-sm text-[18px] text-primary font-bold tracking-tight">
            Mi Perfil
          </h1>
          <span className="text-[11px] text-outline flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50]"></span>
            Explorador Atlántico
          </span>
        </div>

        {/* Settings button shortcut */}
        <button
          onClick={() => navigateTo('settings')}
          aria-label="Configuración"
          className="clay-button-circle w-11 h-11 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">settings</span>
        </button>
      </header>

      {/* MAIN CONTAINER */}
      <main className="px-5 pt-3 flex flex-col gap-4 flex-1">
        {user.role === 'admin' && (
          <button
            onClick={() => navigateTo('admin')}
            className="clay-card rounded-[22px] p-4 flex items-center justify-between text-left text-primary font-bold"
          >
            <span className="flex items-center gap-3"><span className="material-symbols-outlined">admin_panel_settings</span> Panel administrativo</span>
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        )}
        {/* User Card */}
        <div className="clay-card rounded-[32px] p-6 text-center flex flex-col items-center shadow-lg relative overflow-hidden">
          {/* Top subtle Caribbean gradient background */}
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#FFEFE8] to-transparent pointer-events-none" />

          <div className="relative w-24 h-24 mb-3 z-10">
            <div className="w-full h-full rounded-full p-1.5 clay-badge-yellow shadow-md">
              <img
                src={user.avatarUrl || IMAGES.mascot.pelicanAvatar}
                alt={user.name}
                className="w-full h-full object-cover rounded-full bg-white"
              />
            </div>
            <span className="absolute bottom-1 right-1 w-6 h-6 bg-[#4CAF50] rounded-full border-2 border-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-white text-[14px]">check</span>
            </span>
          </div>

          <h2 className="text-[20px] font-bold text-on-surface tracking-tight z-10">
            {user.name}
          </h2>
          <p className="text-[13px] text-on-surface-variant font-medium mt-0.5 z-10">
            {user.email}
          </p>

          <div className="inline-flex items-center gap-1.5 clay-badge-coral px-4 py-1 rounded-full text-white text-[12px] font-bold mt-2.5 shadow-xs z-10">
            <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
            <span>Explorador de {user.homeCity}</span>
          </div>

          {/* Stats Row in Mini Clay Cards */}
          <div className="grid grid-cols-3 gap-2.5 w-full mt-5 pt-4 border-t border-black/5 z-10">
            <div className="clay-card p-3 rounded-2xl flex flex-col items-center">
              <span className="text-[20px] font-black text-primary">
                {user.savedRoutes.length}
              </span>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-0.5">
                Rutas
              </span>
            </div>

            <div className="clay-card p-3 rounded-2xl flex flex-col items-center">
              <span className="text-[20px] font-black text-secondary">
                {user.savedPlaces.length}
              </span>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-0.5">
                Lugares
              </span>
            </div>

            <div className="clay-card p-3 rounded-2xl flex flex-col items-center">
              <span className="text-[20px] font-black text-[#FF9800]">
                5
              </span>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-0.5">
                Reseñas
              </span>
            </div>
          </div>
        </div>

        {/* Insignias del Atlántico */}
        <div className="clay-card rounded-[26px] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">military_tech</span>
              Insignias del Atlántico
            </h3>
            <span className="text-[11px] font-bold text-secondary">4 desbloqueadas</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {badges.map((b) => (
              <div key={b.id} className="flex flex-col items-center text-center gap-1">
                <div className={`w-12 h-12 rounded-2xl ${b.color} text-white flex items-center justify-center shadow-md active:scale-95 transition-transform`}>
                  <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {b.icon}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-on-surface leading-tight mt-0.5">
                  {b.name}
                </span>
                <span className="text-[9px] text-outline line-clamp-1">
                  {b.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Menu Navigation Items */}
        <div className="flex flex-col gap-2.5">
          <div
            onClick={() => navigateTo('favorites')}
            className="clay-card rounded-[22px] p-3.5 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl clay-badge-coral flex items-center justify-center text-white shadow-xs">
                <span className="material-symbols-outlined text-[22px]">favorite</span>
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-on-surface">Mis Guardados</h4>
                <p className="text-[12px] text-on-surface-variant">Rutas y lugares que quieres visitar</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[20px]">
              chevron_right
            </span>
          </div>

          <div
            onClick={() => navigateTo('reviews')}
            className="clay-card rounded-[22px] p-3.5 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl clay-badge-yellow flex items-center justify-center text-white shadow-xs">
                <span className="material-symbols-outlined text-[22px]">rate_review</span>
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-on-surface">Comunidad & Mis Reseñas</h4>
                <p className="text-[12px] text-on-surface-variant">Tus opiniones y fotos compartidas</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[20px]">
              chevron_right
            </span>
          </div>

          <div
            onClick={() => navigateTo('recommendations')}
            className="clay-card rounded-[22px] p-3.5 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl clay-badge-historia flex items-center justify-center text-white shadow-xs">
                <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-on-surface">Recomendaciones RutiGo</h4>
                <p className="text-[12px] text-on-surface-variant">Sugerencias inteligentes para ti</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[20px]">
              chevron_right
            </span>
          </div>

          <div
            onClick={() => navigateTo('notifications')}
            className="clay-card rounded-[22px] p-3.5 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl clay-badge-turquesa flex items-center justify-center text-white shadow-xs">
                <span className="material-symbols-outlined text-[22px]">notifications</span>
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-on-surface">Notificaciones</h4>
                <p className="text-[12px] text-on-surface-variant">Alertas de nuevas rutas y festivales</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[20px]">
              chevron_right
            </span>
          </div>

          <div
            onClick={() => navigateTo('settings')}
            className="clay-card rounded-[22px] p-3.5 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#E8EDEB] flex items-center justify-center text-on-surface-variant shadow-xs">
                <span className="material-symbols-outlined text-[22px]">settings</span>
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-on-surface">Configuración</h4>
                <p className="text-[12px] text-on-surface-variant">Preferencias, GPS y cuenta</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[20px]">
              chevron_right
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <div className="pt-2 pb-2">
          <button
            onClick={logout}
            className="w-full clay-card py-3.5 rounded-full text-center text-[14px] font-bold text-error flex items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer shadow-sm hover:bg-error/5"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Cerrar Sesión
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

