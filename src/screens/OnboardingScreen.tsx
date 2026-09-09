/**
 * 2. Onboarding Screen
 * 3-step carousel with 3D clay graphics, category feature badges,
 * progress dots, and CTA buttons to authenticate or skip.
 */
import React, { useState } from 'react';
import { useApp } from '../store';
import { IMAGES } from '../assets/images';
import { Button } from '../components/Button';

interface OnboardingStep {
  title: string;
  highlight: string;
  description: string;
  image: string;
  badge: { icon: string; text: string; color: string };
}

const STEPS: OnboardingStep[] = [
  {
    title: 'Explora los tesoros del',
    highlight: 'Atlántico Mágico',
    description:
      'Descubre rutas artesanales en Usiacurí, atardeceres coloniales en Salgar y sabores autóctonos en Baranoa.',
    image: IMAGES.mascot.iguanaSuitcase,
    badge: { icon: 'palette', text: 'Cultura & Artesanías', color: 'bg-[#A895FF]/20 text-[#5B3EE6]' },
  },
  {
    title: 'Geolocalización & Rutas',
    highlight: 'a tu propio ritmo',
    description:
      'Mapas interactivos con puntos GPS precisos, distancias exactas y tiempos estimados a pie o en auto.',
    image: IMAGES.mascot.iguanaMapIsland,
    badge: { icon: 'near_me', text: 'GPS en Tiempo Real', color: 'bg-[#00C2CB]/20 text-[#00696E]' },
  },
  {
    title: 'Comunidad de Viajeros &',
    highlight: 'Reseñas Reales',
    description:
      'Guarda tus rutas favoritas, califica experiencias auténticas y apoya a las familias artesanas del Caribe.',
    image: IMAGES.mascot.iguanaSmiling,
    badge: { icon: 'star', text: '5 Estrellas Caribeñas', color: 'bg-[#FFC93C]/25 text-[#B87500]' },
  },
];

export const OnboardingScreen: React.FC = () => {
  const { navigateTo } = useApp();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigateTo('login');
    }
  };

  const step = STEPS[currentStep];

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-between items-center px-gutter-mobile py-space-md bg-gradient-to-b from-[#FFFDF9] via-[#F9F4FF] to-[#FFF5F0] overflow-hidden select-none">
      {/* Top Header with Skip */}
      <header className="w-full max-w-sm flex items-center justify-between z-10 pt-2">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-primary-container inline-block animate-pulse" />
          <span className="text-label-md font-label-md font-bold text-primary tracking-wide">
            RUTIGO
          </span>
        </div>
        <button
          onClick={() => navigateTo('login')}
          className="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors font-semibold px-3 py-1 rounded-full hover:bg-white/80"
        >
          Saltar
        </button>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-sm flex-1 flex flex-col items-center justify-center my-4 z-10 text-center">
        {/* 3D Visual Hero Container */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center mb-6">
          {/* Backing Ambient Halo */}
          <div className="absolute inset-4 rounded-3xl bg-gradient-to-tr from-primary-fixed/40 via-white to-secondary-fixed/40 shadow-[0_16px_36px_rgba(255,122,89,0.18)] border-2 border-white/90 transform rotate-1 transition-all duration-500" />

          {/* 3D Mascot Image */}
          <div className="relative z-10 w-full h-full p-4 flex items-center justify-center">
            <img
              src={step.image}
              alt={step.title}
              key={currentStep}
              className="w-full h-full object-contain drop-shadow-2xl animate-fade-in transition-all duration-300"
            />
          </div>

          {/* Floating Badge */}
          <div
            className={`absolute -bottom-2 z-20 px-4 py-1.5 rounded-full border border-white shadow-md flex items-center gap-1.5 backdrop-blur-md ${step.badge.color}`}
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {step.badge.icon}
            </span>
            <span className="text-label-sm font-label-sm font-bold">
              {step.badge.text}
            </span>
          </div>
        </div>

        {/* Text Container */}
        <div className="flex flex-col items-center space-y-2.5 px-2">
          <h2 className="text-headline-lg font-headline-lg text-on-surface leading-tight font-extrabold">
            {step.title}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container to-primary">
              {step.highlight}
            </span>
          </h2>
          <p className="text-body-md font-body-md text-on-surface-variant max-w-xs leading-relaxed">
            {step.description}
          </p>
        </div>
      </main>

      {/* Footer Navigation: Dots & Primary Pill Button */}
      <footer className="w-full max-w-sm flex flex-col items-center gap-5 z-10 pb-4">
        {/* Step Dots */}
        <div className="flex items-center gap-2">
          {STEPS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              aria-label={`Paso ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentStep
                  ? 'w-8 bg-gradient-to-r from-primary-container to-primary shadow-sm'
                  : 'w-2.5 bg-[#E0D5CF] hover:bg-outline'
              }`}
            />
          ))}
        </div>

        {/* CTA Button */}
        <Button
          onClick={handleNext}
          variant="primary"
          size="lg"
          fullWidth
          icon={currentStep === STEPS.length - 1 ? 'rocket_launch' : 'arrow_forward'}
          iconPosition="right"
        >
          {currentStep === STEPS.length - 1 ? '¡Empezar Aventura!' : 'Siguiente'}
        </Button>

        {currentStep === STEPS.length - 1 && (
          <p className="text-label-sm font-label-sm text-on-surface-variant">
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={() => navigateTo('login')}
              className="font-bold text-primary hover:underline"
            >
              Inicia sesión
            </button>
          </p>
        )}
      </footer>
    </div>
  );
};
