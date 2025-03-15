import { StateCreator } from 'zustand';

/**
 * Crea un middleware de Reactotron para Zustand que registra todas las actualizaciones de estado
 *
 * @param storeName Nombre del store para identificarlo en Reactotron
 * @returns Middleware configurado para el store específico
 */
export const createReactotronMiddleware = <T extends object>(
  storeName: string,
) => {
  return (config: StateCreator<T>): StateCreator<T> =>
    (set, get, api) => {
      // Solo aplicar en desarrollo
      if (!__DEV__) {
        return config(set, get, api);
      }

      // Función mejorada de set que registra cambios en Reactotron
      const trackedSet: typeof set = (args) => {
        // Capturar el estado anterior
        const prevState = get();

        // Aplicar la actualización normalmente
        set(args);

        // Capturar el nuevo estado
        const nextState = get();

        // Determinar si es una función o un objeto
        const isFunction = typeof args === 'function';

        // Registrar en Reactotron
        try {
          const reactotron = require('../../../../ReactotronConfig').default;

          reactotron.display({
            name: `ZUSTAND [${storeName}]`,
            preview: isFunction ? 'Function Update' : 'State Update',
            value: {
              previous: prevState,
              next: nextState,
              diff: getDiff(prevState, nextState),
              updater: isFunction ? 'fn()' : args,
            },
          });
        } catch (error) {
          console.warn('Reactotron logging failed:', error);
        }
      };

      // Devolver el config original con nuestro set modificado
      return config(trackedSet, get, api);
    };
};

/**
 * Obtiene la diferencia entre dos estados
 */
function getDiff<T extends object>(prev: T, next: T): Partial<T> {
  const diff = {} as Partial<T>;

  // Recorrer todas las claves del nuevo estado
  Object.keys(next).forEach((key) => {
    const typedKey = key as keyof T;
    // Si el valor ha cambiado, añadirlo al diff
    if (prev[typedKey] !== next[typedKey]) {
      diff[typedKey] = next[typedKey];
    }
  });

  return diff;
}

/**
 * Aplica el middleware de Reactotron a un store
 *
 * @param storeName Nombre del store
 * @param config Configuración del store
 * @returns Store con middleware aplicado
 */
export function withReactotronMiddleware<T extends object>(
  storeName: string,
  config: StateCreator<T>,
): StateCreator<T> {
  return __DEV__ ? createReactotronMiddleware<T>(storeName)(config) : config;
}
