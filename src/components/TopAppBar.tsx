/**
 * TopAppBar Reusable Component
 * Features RutiGo 3D Mascot Avatar, Title, Live Status / Breadcrumb, and Notifications Button
 */
import React from 'react';
import { useApp } from '../store';
import { IMAGES } from '../assets/images';

interface TopAppBarProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  showNotifications?: boolean;
  trailing?: React.ReactNode;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  title = 'Barranquilla & Atlántico',
  subtitle = 'Guía costera activa',
  showBack = false,
  onBack,
  showNotifications = true,
  trailing,
}) => {
  const { navigateTo, unreadNotifsCount, goBack } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-surface/85 backdrop-blur-md px-gutter-mobile py-2.5 flex justify-between items-center w-full border-b border-surfaceContainerLow/50 shadow-xs transition-all">
      <div className="flex items-center gap-2.5">
        {showBack ? (
          <button
            onClick={onBack || goBack}
            aria-label="Volver"
            className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-on-surface hover:text-primary active:scale-90 transition-all border border-white/80"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </button>
        ) : (
          <div
            onClick={() => navigateTo('profile')}
            className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-primary-fixed to-primary-container p-0.5 shadow-sm active:scale-95 transition-transform duration-150 cursor-pointer flex-shrink-0"
          >
            <img
              src={IMAGES.mascot.pelicanAvatar}
              alt="Mascota RutiGo"
              className="w-full h-full object-cover rounded-full"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
          </div>
        )}

        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-headline-sm font-headline-sm text-primary leading-tight font-extrabold tracking-tight">
              {title}
            </span>
          </div>
          {subtitle && (
            <span className="text-label-sm font-label-sm text-on-surface-variant flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              {subtitle}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {trailing}
        {showNotifications && (
          <button
            onClick={() => navigateTo('notifications')}
            aria-label="Notificaciones"
            className="relative w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm hover:bg-surfaceContainerHigh transition-all active:scale-95 border border-white/80"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadNotifsCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-primary-container rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>
        )}
      </div>
    </header>
  );
};
