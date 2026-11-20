// Shim de seguridad para garantizar compatibilidad con versiones compiladas (APKs) anteriores.
// Si un APK antiguo no tiene compilado un módulo nativo (como expo-notifications o expo-task-manager),
// este proxy evita que `requireNativeModule` arroje un error fatal en tiempo de inicio,
// permitiendo que Expo Updates cargue la versión actualizada sin fallar ni revertir.

if (typeof globalThis !== 'undefined') {
  try {
    if (!globalThis.expo) {
      (globalThis as any).expo = { modules: {} };
    }
    if (globalThis.expo && !globalThis.expo.modules) {
      (globalThis as any).expo.modules = {};
    }

    if (globalThis.expo && globalThis.expo.modules) {
      const originalModules = (globalThis as any).expo.modules;

      const createSafeDummy = (): any => {
        const dummyFn: any = () => Promise.resolve();
        return new Proxy(dummyFn, {
          get: (_target, prop) => {
            if (prop === 'addListener' || prop === 'removeListener' || prop === 'removeAllListeners') {
              return () => ({ remove: () => {} });
            }
            if (prop === 'then') return undefined; // No tratar como Promise
            if (prop === 'shouldShowAlert' || prop === 'shouldPlaySound' || prop === 'shouldSetBadge') {
              return true;
            }
            return createSafeDummy();
          },
          apply: () => Promise.resolve(),
        });
      };

      const dummyProxy = createSafeDummy();

      (globalThis as any).expo.modules = new Proxy(originalModules, {
        get: (target, prop) => {
          if (prop in target) {
            return target[prop];
          }
          if (
            typeof prop === 'string' &&
            (prop.startsWith('Expo') || prop.includes('Notification') || prop.includes('Task') || prop.includes('Background'))
          ) {
            return dummyProxy;
          }
          return target[prop];
        },
      });
    }
  } catch (err) {
    console.warn('[SafetyShim] Error al inicializar proxy de compatibilidad nativa:', err);
  }
}

export {};
