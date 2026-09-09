/**
 * 17. Settings Screen - Configuración RutiGo Atlántico
 * Tactile Claymorphism Design matching user specification
 */
import React, { useState } from 'react';
import { useApp } from '../store';

export const SettingsScreen: React.FC = () => {
  const { currentUser, goBack, logout } = useApp();
  const [routeNotifs, setRouteNotifs] = useState(true);
  const [gpsSuggestions, setGpsSuggestions] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [language, setLanguage] = useState('Español (Colombia)');
  const [units, setUnits] = useState('Kilómetros (km)');

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="w-full min-h-screen bg-mesh-caribbean flex flex-col relative pb-10 overflow-x-hidden text-on-surface">
      {/* TOP APP BAR */}
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md px-5 pt-4 pb-3 flex justify-between items-center w-full shadow-sm">
        {/* Back Action */}
        <button
          onClick={goBack}
          aria-label="Regresar"
          className="clay-button-circle w-11 h-11 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </button>

        {/* Centered Screen Title */}
        <div className="flex flex-col items-center">
          <h1 className="font-headline-sm text-[18px] text-primary font-bold tracking-tight">
            Configuración
          </h1>
          <span className="text-[11px] text-outline flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            RutiGo Caribe
          </span>
        </div>

        {/* Mascot Avatar Mini 3D: Iguana con sombrero vueltiao */}
        <div className="relative w-11 h-11 rounded-full p-0.5 clay-badge-yellow flex items-center justify-center shadow-md">
          <img
            className="w-full h-full object-cover rounded-full"
            alt="Mascota RutiGo"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3wqUfUANEHM4SGv-sBMgwJ9_fg8NdmxVvRu511ORGgDRwcr5Q9qjvKZETziEebWHZCwhD4d68LqiV1Am68jSsP9JIzS7P3nZIFfnHCztWyxRtS2Vh6zkTmFuz4Obg3R4LkTmNu0YPltLK9VEDSWKIxZ_GRPjnxgpvW3unMV6tYVPp-kCNI__IkqIcj8QxxCoqCcpSkSUBPdFHj3ai8qEg8ti0NZ2mAPT5e0K4I3sQ9WfcbT_aBOGQ"
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-primary-container border-2 border-white rounded-full flex items-center justify-center">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
          </span>
        </div>
      </header>

      {/* MAIN SCROLL CONTENT */}
      <main className="flex-1 px-5 pt-4 flex flex-col gap-6">
        {/* SECTION 1: CUENTA */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[15px] font-bold text-on-surface-variant flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary-container"></span>
              Cuenta
            </h2>
            <span className="text-[11px] text-outline">Perfil & Acceso</span>
          </div>

          <div className="clay-card p-2 flex flex-col divide-y divide-surface-container-high/60">
            {/* Item: Editar Perfil */}
            <button
              onClick={() => alert('Edición de perfil')}
              className="w-full flex items-center justify-between py-3 px-2 group transition-transform active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl clay-badge-coral flex items-center justify-center text-white shrink-0">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    person
                  </span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[15px] font-bold leading-tight text-on-surface group-hover:text-primary transition-colors">
                    Editar información de perfil
                  </span>
                  <span className="text-[13px] text-outline">
                    Nombre, avatar y biografía
                  </span>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-surface-container-low flex items-center justify-center text-outline group-hover:translate-x-0.5 transition-all">
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </div>
            </button>

            {/* Item: Seguridad */}
            <button
              onClick={() => alert('Seguridad y PIN')}
              className="w-full flex items-center justify-between py-3 px-2 group transition-transform active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl clay-badge-purple flex items-center justify-center text-white shrink-0">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    shield
                  </span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[15px] font-bold leading-tight text-on-surface group-hover:text-primary transition-colors">
                    Contraseña y seguridad
                  </span>
                  <span className="text-[13px] text-outline">
                    Huella dactilar, PIN y accesos
                  </span>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-surface-container-low flex items-center justify-center text-outline group-hover:translate-x-0.5 transition-all">
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </div>
            </button>

            {/* Item: Contacto Vinculado */}
            <button
              onClick={() => alert('Contacto vinculado')}
              className="w-full flex items-center justify-between py-3 px-2 group transition-transform active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl clay-badge-turquesa flex items-center justify-center text-white shrink-0">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    mail
                  </span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[15px] font-bold leading-tight text-on-surface group-hover:text-primary transition-colors">
                    Correo y teléfonos vinculados
                  </span>
                  <span className="text-[13px] text-outline">
                    {currentUser?.email || 'carlos.costero@rutigo.co'}
                  </span>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-surface-container-low flex items-center justify-center text-outline group-hover:translate-x-0.5 transition-all">
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </div>
            </button>
          </div>
        </section>

        {/* SECTION 2: PREFERENCIAS DE VIAJE */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[15px] font-bold text-on-surface-variant flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              Preferencias de Viaje
            </h2>
            <span className="text-[11px] text-outline">Personalización</span>
          </div>

          <div className="clay-card p-2 flex flex-col divide-y divide-surface-container-high/60">
            {/* Switch Coral: Notificaciones de rutas y eventos */}
            <div className="flex items-center justify-between py-3 px-2">
              <div className="flex items-center gap-3 pr-2">
                <div className="w-10 h-10 rounded-2xl bg-surface-container flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[20px]">notifications_active</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[15px] font-bold leading-tight text-on-surface">
                    Notificaciones de rutas
                  </span>
                  <span className="text-[13px] text-outline">
                    Festivales, playas y paradas del día
                  </span>
                </div>
              </div>
              {/* Pill Switch Coral Activo */}
              <button
                onClick={() => setRouteNotifs(!routeNotifs)}
                aria-checked={routeNotifs}
                className={`w-14 h-8 rounded-full p-1 relative flex items-center shrink-0 transition-all cursor-pointer ${
                  routeNotifs ? 'clay-badge-coral justify-end' : 'clay-toggle-track-off justify-start'
                }`}
                role="switch"
              >
                <span className="clay-toggle-thumb w-6 h-6 rounded-full inline-block"></span>
              </button>
            </div>

            {/* Switch Turquesa: Sugerencias según geolocalización */}
            <div className="flex items-center justify-between py-3 px-2">
              <div className="flex items-center gap-3 pr-2">
                <div className="w-10 h-10 rounded-2xl bg-surface-container flex items-center justify-center text-secondary shrink-0">
                  <span className="material-symbols-outlined text-[20px]">near_me</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[15px] font-bold leading-tight text-on-surface">
                    Sugerencias por GPS
                  </span>
                  <span className="text-[13px] text-outline">
                    Descubre spots a pocos metros
                  </span>
                </div>
              </div>
              {/* Pill Switch Turquesa Activo */}
              <button
                onClick={() => setGpsSuggestions(!gpsSuggestions)}
                aria-checked={gpsSuggestions}
                className={`w-14 h-8 rounded-full p-1 relative flex items-center shrink-0 transition-all cursor-pointer ${
                  gpsSuggestions ? 'clay-badge-turquesa justify-end' : 'clay-toggle-track-off justify-start'
                }`}
                role="switch"
              >
                <span className="clay-toggle-thumb w-6 h-6 rounded-full inline-block"></span>
              </button>
            </div>

            {/* Selector Pill: Idioma de la aplicación */}
            <div className="flex items-center justify-between py-3 px-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0">
                  <span className="material-symbols-outlined text-[20px]">translate</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[15px] font-bold leading-tight text-on-surface">
                    Idioma
                  </span>
                  <span className="text-[13px] text-outline">
                    Vocabulario regional
                  </span>
                </div>
              </div>
              <button
                onClick={() => setLanguage(language === 'Español (Colombia)' ? 'English' : 'Español (Colombia)')}
                className="clay-pill-selector px-3 py-1.5 rounded-full flex items-center gap-1.5 text-primary hover:bg-white transition-all active:scale-95 cursor-pointer"
              >
                <span className="text-[11px] font-bold">{language}</span>
                <span className="material-symbols-outlined text-[16px] text-outline">expand_more</span>
              </button>
            </div>

            {/* Selector Pill: Unidades de distancia */}
            <div className="flex items-center justify-between py-3 px-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0">
                  <span className="material-symbols-outlined text-[20px]">straighten</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[15px] font-bold leading-tight text-on-surface">
                    Unidades de distancia
                  </span>
                  <span className="text-[13px] text-outline">
                    Medición en senderos
                  </span>
                </div>
              </div>
              <button
                onClick={() => setUnits(units === 'Kilómetros (km)' ? 'Millas (mi)' : 'Kilómetros (km)')}
                className="clay-pill-selector px-3 py-1.5 rounded-full flex items-center gap-1.5 text-on-surface hover:bg-white transition-all active:scale-95 cursor-pointer"
              >
                <span className="text-[11px] font-semibold">{units}</span>
                <span className="material-symbols-outlined text-[16px] text-outline">unfold_more</span>
              </button>
            </div>

            {/* Switch Desactivado: Modo sin conexión / Descarga de mapas */}
            <div className="flex items-center justify-between py-3 px-2">
              <div className="flex items-center gap-3 pr-2">
                <div className="w-10 h-10 rounded-2xl bg-surface-container flex items-center justify-center text-outline shrink-0">
                  <span className="material-symbols-outlined text-[20px]">cloud_download</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[15px] font-bold leading-tight text-on-surface">
                    Modo sin conexión
                  </span>
                  <span className="text-[13px] text-outline">
                    Mapas descargados en memoria
                  </span>
                </div>
              </div>
              <button
                onClick={() => setOfflineMode(!offlineMode)}
                aria-checked={offlineMode}
                className={`w-14 h-8 rounded-full p-1 relative flex items-center shrink-0 transition-all cursor-pointer ${
                  offlineMode ? 'clay-badge-coral justify-end' : 'clay-toggle-track-off justify-start'
                }`}
                role="switch"
              >
                <span className="clay-toggle-thumb w-6 h-6 rounded-full inline-block"></span>
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 3: PRIVACIDAD Y LEGAL */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[15px] font-bold text-on-surface-variant flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-tertiary"></span>
              Privacidad y Legal
            </h2>
            <span className="text-[11px] text-outline">Transparencia</span>
          </div>

          <div className="clay-card p-2 flex flex-col divide-y divide-surface-container-high/60">
            {/* Item: Permisos de ubicación */}
            <button
              onClick={() => alert('Gestión de permisos de ubicación y GPS en tiempo real')}
              className="w-full flex items-center justify-between py-3 px-2 group transition-transform active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-surface-container flex items-center justify-center text-tertiary shrink-0">
                  <span className="material-symbols-outlined text-[20px]">location_on</span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[15px] font-bold leading-tight text-on-surface group-hover:text-primary transition-colors">
                    Permisos de ubicación en vivo
                  </span>
                  <span className="text-[13px] text-outline">
                    Gestión precisa de GPS y radares
                  </span>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-surface-container-low flex items-center justify-center text-outline group-hover:translate-x-0.5 transition-all">
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </div>
            </button>

            {/* Item: Política de privacidad */}
            <button
              onClick={() => alert('Políticas de privacidad y términos turísticos del Atlántico')}
              className="w-full flex items-center justify-between py-3 px-2 group transition-transform active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-surface-container flex items-center justify-center text-tertiary shrink-0">
                  <span className="material-symbols-outlined text-[20px]">gavel</span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[15px] font-bold leading-tight text-on-surface group-hover:text-primary transition-colors">
                    Política de privacidad
                  </span>
                  <span className="text-[13px] text-outline">
                    Términos turísticos de uso
                  </span>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-surface-container-low flex items-center justify-center text-outline group-hover:translate-x-0.5 transition-all">
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </div>
            </button>
          </div>
        </section>

        {/* SECTION 4: ACERCA DE RUTIGO & ALIANZA */}
        <section className="clay-card p-5 flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-2xl clay-badge-coral flex items-center justify-center text-white shadow-md">
            <span className="material-symbols-outlined text-[28px]">explore</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[18px] text-on-surface font-extrabold tracking-tight">
              RutiGo Atlántico
            </span>
            <span className="text-[11px] text-primary font-bold mt-0.5">
              Versión 2.4.0 • Atlántico Para el Mundo
            </span>
          </div>
          <div className="w-full h-px bg-surface-variant my-1"></div>
          {/* Alianza badge soft clay */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-full border border-white/60 shadow-xs">
            <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
            <span className="text-[13px] text-on-surface-variant font-medium">
              En alianza con Gobernación del Atlántico
            </span>
          </div>
        </section>

        {/* SECCIÓN DESTACADA: BOTÓN CERRAR SESIÓN */}
        <section className="pt-2 pb-6">
          <button
            onClick={handleLogout}
            className="w-full clay-logout-button py-3.5 px-4 rounded-full flex items-center justify-center gap-2 text-error font-bold text-[16px] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              logout
            </span>
            <span>Cerrar sesión</span>
          </button>
        </section>
      </main>
    </div>
  );
};

