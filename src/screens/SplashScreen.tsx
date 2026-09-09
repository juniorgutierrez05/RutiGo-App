/**
 * 1. Splash Screen
 * Features 3D Iguana mascot with sombrero vueltiao, volumetric glowing sun,
 * progress bar with specular shimmer, and Caribbean branding.
 */
import React, { useEffect, useState } from 'react';
import { useApp } from '../store';
import { IMAGES } from '../assets/images';

export const SplashScreen: React.FC = () => {
  const { navigateTo } = useApp();
  const [progress, setProgress] = useState(25);

  useEffect(() => {
    const timer1 = setTimeout(() => setProgress(65), 500);
    const timer2 = setTimeout(() => setProgress(100), 1400);
    const timer3 = setTimeout(() => {
      navigateTo('onboarding');
    }, 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [navigateTo]);

  return (
    <div
      onClick={() => navigateTo('onboarding')}
      className="relative w-full min-h-screen flex flex-col justify-between items-center px-gutter-mobile py-space-xl overflow-hidden bg-gradient-to-b from-[#FEF7FF] via-[#F9F1FF] to-[#E8DFF3] cursor-pointer select-none"
    >
      {/* Tactile Clay Ambient Background Orbs */}
      <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-gradient-to-tr from-[#61F4FD]/40 to-[#6BF6FF]/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-[#FFDAD2]/50 via-[#FF7A59]/20 to-[#A7391E]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-1/4 w-88 h-88 rounded-full bg-gradient-to-t from-[#EEE4F9]/60 to-[#FEF7FF] blur-2xl pointer-events-none" />

      {/* Top Caribbean Branding & Department Anchor */}
      <header className="relative z-10 w-full max-w-sm flex items-center justify-between pt-space-xs">
        <div className="flex items-center space-x-1.5 bg-white/85 backdrop-blur-md px-4 py-2 rounded-full border border-white/90 shadow-sm">
          <span
            className="material-symbols-outlined text-[#00696E] text-[18px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            explore
          </span>
          <span className="font-label-sm text-label-sm text-[#00696E] font-bold">
            Caribe Colombiano
          </span>
        </div>

        <div className="flex items-center space-x-1.5 bg-white/80 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/80 shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3EDAE3] inline-block animate-ping" />
          <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">
            Atlántico
          </span>
        </div>
      </header>

      {/* Center Hero 3D Clay Scene */}
      <main className="relative z-10 w-full max-w-sm flex-1 flex flex-col items-center justify-center my-4">
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center mb-space-lg">
          {/* Volumetric 3D Sun Layer (Floating Top-Right) */}
          <div className="absolute -top-2 right-4 z-20 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#FFDF9A] via-[#F4BF32] to-[#CA9A00] shadow-[0_12px_28px_rgba(254,197,60,0.35),inset_0_3px_6px_rgba(255,255,255,0.85),inset_0_-3px_6px_rgba(184,80,0,0.15)] flex items-center justify-center animate-pulse border-2 border-white/90">
            <span
              className="material-symbols-outlined text-[#251A00] text-[32px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              wb_sunny
            </span>
          </div>

          {/* Floating Cloud/Clay Cushion Behind Character */}
          <div className="absolute inset-2 bg-gradient-to-tr from-white via-[#F9F1FF] to-[#61F4FD]/30 rounded-3xl shadow-[0_16px_36px_-8px_rgba(255,122,89,0.22),0_8px_16px_-4px_rgba(46,41,56,0.05)] border-2 border-white/85 transform -rotate-1 pointer-events-none" />

          {/* 3D Mascot Clay Illustration */}
          <div className="relative z-10 w-full h-full p-space-sm flex items-center justify-center animate-bounce duration-1000">
            <img
              src={IMAGES.mascot.iguanaMain}
              alt="RutiGo Iguana Mascot"
              className="w-full h-full object-contain drop-shadow-2xl rounded-2xl pointer-events-none"
            />
          </div>

          {/* Micro Floating Clay Badge */}
          <div className="absolute -bottom-2 -left-2 z-20 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white flex items-center space-x-1.5 shadow-md">
            <span
              className="material-symbols-outlined text-primary-container text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              travel_explore
            </span>
            <span className="font-label-sm text-label-sm text-on-surface font-bold">
              Ruta Bocas de Ceniza
            </span>
          </div>
        </div>

        {/* App Identity Typography & Soft Volumetric Badge */}
        <div className="text-center flex flex-col items-center space-y-space-xs">
          <h1 className="text-[44px] font-extrabold text-on-surface tracking-tight leading-none">
            Ruti
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container via-[#A7391E] to-primary">
              Go
            </span>
          </h1>

          {/* Department Cultural Seal */}
          <div className="inline-flex items-center space-x-1.5 bg-[#EEE4F9]/80 px-4 py-1.5 rounded-full border border-white/80 shadow-sm mt-1">
            <span
              className="material-symbols-outlined text-[#CA9A00] text-[16px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
            <span className="font-label-md text-label-md text-on-surface font-bold">
              Atlántico Mágico
            </span>
          </div>
        </div>
      </main>

      {/* Bottom Loading Capsule & Progress Status */}
      <footer className="relative z-10 w-full max-w-xs flex flex-col items-center pb-space-sm space-y-space-sm">
        <div className="w-full h-3.5 bg-white/90 rounded-full p-0.5 shadow-[inset_0_2px_4px_rgba(46,41,56,0.06),0_4px_10px_rgba(255,122,89,0.1)] overflow-hidden relative border border-white">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#3EDAE3] via-[#FF7A59] to-[#A7391E] relative transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent skew-x-12 animate-pulse" />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="material-symbols-outlined text-primary-container animate-spin text-[16px]">
            progress_activity
          </span>
          <p className="font-label-md text-label-md text-on-surface-variant font-semibold">
            Cargando rutas del Caribe...
          </p>
        </div>

        <p className="font-label-sm text-label-sm text-outline tracking-wider pt-space-2xs text-center">
          Barranquilla • Puerto Colombia • Usiacurí
        </p>
      </footer>
    </div>
  );
};
