/**
 * 18. Notifications Screen - Notificaciones RutiGo
 * Tactile Claymorphism design with Caribbean alerts & news
 */
import React, { useState } from 'react';
import { useApp } from '../store';
import { BottomNav } from '../components/BottomNav';

export const NotificationsScreen: React.FC = () => {
  const { notifications, markNotificationRead, navigateTo, goBack } = useApp();
  const [filter, setFilter] = useState<'all' | 'routes' | 'events' | 'alerts'>('all');

  const handleNotificationClick = async (notif: typeof notifications[0]) => {
    await markNotificationRead(notif.id);
    if (notif.relatedId?.startsWith('route_')) {
      navigateTo('route_detail', { routeId: notif.relatedId });
    } else if (notif.relatedId?.startsWith('place_')) {
      navigateTo('place_detail', { placeId: notif.relatedId });
    }
  };

  const handleMarkAllRead = async () => {
    for (const notif of notifications) {
      if (!notif.read) {
        await markNotificationRead(notif.id);
      }
    }
  };

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'routes') return n.type === 'new_route';
    if (filter === 'events') return n.type === 'recommendation';
    if (filter === 'alerts') return n.type === 'review_reply';
    return true;
  });

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
            Notificaciones
          </h1>
          <span className="text-[11px] text-outline flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            Novedades & Alertas
          </span>
        </div>

        {/* Mascot Avatar */}
        <div className="relative w-11 h-11 rounded-full p-0.5 clay-badge-yellow flex items-center justify-center shadow-md">
          <img
            className="w-full h-full object-cover rounded-full"
            alt="Mascota RutiGo"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3wqUfUANEHM4SGv-sBMgwJ9_fg8NdmxVvRu511ORGgDRwcr5Q9qjvKZETziEebWHZCwhD4d68LqiV1Am68jSsP9JIzS7P3nZIFfnHCztWyxRtS2Vh6zkTmFuz4Obg3R4LkTmNu0YPltLK9VEDSWKIxZ_GRPjnxgpvW3unMV6tYVPp-kCNI__IkqIcj8QxxCoqCcpSkSUBPdFHj3ai8qEg8ti0NZ2mAPT5e0K4I3sQ9WfcbT_aBOGQ"
          />
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="px-5 pt-3 flex flex-col gap-4 flex-1">
        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'all', label: 'Todas', icon: 'mark_email_read' },
            { id: 'routes', label: 'Rutas', icon: 'alt_route' },
            { id: 'events', label: 'Eventos', icon: 'celebration' },
            { id: 'alerts', label: 'Alertas', icon: 'notifications_active' },
          ].map((item) => {
            const isActive = filter === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setFilter(item.id as any)}
                className={`px-4 py-2 rounded-full text-[13px] font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'clay-btn-coral text-white shadow-md'
                    : 'clay-pill-selector text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Notifications List */}
        <div className="flex flex-col gap-3">
          {filteredNotifs.length === 0 ? (
            <div className="clay-card p-8 rounded-[28px] text-center flex flex-col items-center gap-3 my-6">
              <div className="w-16 h-16 rounded-full clay-badge-turquesa flex items-center justify-center text-white shadow-md">
                <span className="material-symbols-outlined text-[32px]">notifications_none</span>
              </div>
              <h3 className="text-[17px] font-bold text-on-surface">Sin notificaciones</h3>
              <p className="text-[13px] text-on-surface-variant max-w-xs">
                ¡Todo al día! Te avisaremos cuando haya nuevos planes o festivales en el Atlántico.
              </p>
            </div>
          ) : (
            filteredNotifs.map((notif) => {
              const badgeClass =
                notif.type === 'new_route'
                  ? 'clay-badge-coral'
                  : notif.type === 'recommendation'
                  ? 'clay-badge-yellow'
                  : 'clay-badge-turquesa';

              const iconName =
                notif.type === 'new_route'
                  ? 'alt_route'
                  : notif.type === 'recommendation'
                  ? 'wb_sunny'
                  : 'thumb_up';

              return (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`clay-card rounded-[24px] p-4 flex gap-3.5 items-start cursor-pointer transition-all active:scale-[0.98] ${
                    !notif.read ? 'ring-2 ring-primary/20' : 'opacity-90'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-2xl ${badgeClass} flex items-center justify-center text-white shrink-0 shadow-xs`}>
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {iconName}
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-[14px] font-bold text-on-surface leading-tight">
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 shadow-xs"></span>
                      )}
                    </div>

                    <p className="text-[13px] text-on-surface-variant mt-1 leading-relaxed">
                      {notif.body}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-1">
                      <span className="text-[11px] text-outline font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">schedule</span>
                        {new Date(notif.createdAt).toLocaleDateString('es-CO', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>

                      <span className="text-[11px] font-bold text-primary flex items-center gap-0.5">
                        Ver aviso
                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Action: Mark All Read */}
        {notifications.some((n) => !n.read) && (
          <div className="pt-2 pb-4">
            <button
              onClick={handleMarkAllRead}
              className="w-full clay-card py-3 rounded-full text-center text-[13px] font-bold text-primary active:scale-95 transition-transform cursor-pointer"
            >
              Marcar todas como leídas
            </button>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

