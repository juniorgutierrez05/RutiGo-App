/**
 * 19. Recommendations Screen
 * Personalized travel itinerary curation based on time of day, weather, and interests.
 */
import React from 'react';
import { useApp } from '../store';
import { TopAppBar } from '../components/TopAppBar';
import { BottomNav } from '../components/BottomNav';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { IMAGES } from '../assets/images';

export const RecommendationsScreen: React.FC = () => {
  const { navigateTo, goBack } = useApp();

  const curatedPlans = [
    {
      title: 'Plan de Fin de Semana: Artesanías & Sazón',
      tag: 'Cultura + Gastronomía',
      duration: '1 día (Sábado o Domingo)',
      description:
        'Visita los macromurales en techos de Usiacurí por la mañana, compra piezas tejidas en palma de iraca, y almuerza un pastel campesino en Pital de Megua.',
      image: IMAGES.usiacuri.aerialMurales,
      routeId: 'route_usiacuri',
    },
    {
      title: 'Tarde de Brisa Marina & Atardecer de Salgar',
      tag: 'Historia + Paisaje',
      duration: '4 horas (3:30 PM - 7:30 PM)',
      description:
        'Camina sobre el centenario Muelle de Puerto Colombia, degusta cócteles caribeños en el Malecón del Mar y presencia la puesta del sol sobre los riscos del Castillo de Salgar.',
      image: IMAGES.puertoColombia.castilloSalgar,
      routeId: 'route_mar_caribe',
    },
    {
      title: 'Ruta Dorada: Sabana Viva & Girasoles',
      tag: 'Fotografía + Familia',
      duration: 'Medio día',
      description:
        'Paseo fotográfico entre millones de girasoles florecidos en Baranoa, acompañado de música folclórica y repostería de yuca tradicional.',
      image: IMAGES.naturaleza.girasolesBaranoa,
      routeId: 'route_sabana_girasol',
    },
  ];

  return (
    <div className="relative w-full min-h-screen bg-background pb-28">
      <TopAppBar
        title="Recomendaciones"
        subtitle="Planes sugeridos por RutiGo"
        showBack={true}
        onBack={goBack}
      />

      <div className="px-gutter-mobile space-y-4 pt-3 max-w-md mx-auto">
        {/* Banner with Mascot */}
        <Card
          variant="hero"
          rounded="3xl"
          padding="md"
          className="flex items-center gap-3.5"
        >
          <div className="w-16 h-16 flex-shrink-0">
            <img
              src={IMAGES.mascot.iguanaSmiling}
              alt="Mascota RutiGo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h3 className="text-label-md font-bold text-primary">
              Planes a tu Medida
            </h3>
            <p className="text-body-sm text-on-surface mt-0.5 leading-snug">
              Hemos diseñado estos itinerarios combinando los mejores horarios de luz, clima y experiencias artesanales.
            </p>
          </div>
        </Card>

        {/* Curated Plans List */}
        <div className="space-y-4">
          {curatedPlans.map((plan, idx) => (
            <Card
              key={idx}
              variant="white"
              rounded="2xl"
              padding="none"
              className="shadow-sm border border-white/90 overflow-hidden"
            >
              <div className="relative h-44 w-full">
                <img
                  src={plan.image}
                  alt={plan.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 bg-primary-container text-white px-3 py-0.5 rounded-full text-[11px] font-bold shadow-md">
                  {plan.tag}
                </span>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[12px] text-[#FFD6A5] font-semibold">{plan.duration}</span>
                  <h4 className="text-headline-sm font-bold text-white leading-tight">
                    {plan.title}
                  </h4>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  {plan.description}
                </p>
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    variant="primary"
                    icon="arrow_forward"
                    iconPosition="right"
                    onClick={() => navigateTo('route_detail', { routeId: plan.routeId })}
                  >
                    Ver Itinerario Completo
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};
