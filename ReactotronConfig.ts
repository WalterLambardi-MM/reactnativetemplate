import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { StateCreator, StoreApi } from 'zustand';
import { NativeModules, Platform } from 'react-native';

// Obtener la IP automáticamente
const getHost = () => {
  const debuggerHost =
    Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
  if (Platform.OS === 'android') {
    const scriptURL = NativeModules.SourceCode?.scriptURL;
    if (scriptURL) {
      const address = scriptURL.split('://')[1].split(':')[0];
      return address;
    }
  }
  return debuggerHost?.split(':')[0] || 'localhost';
};

// Crear y configurar la instancia de Reactotron
const reactotron = Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure({
    name: 'PokéApp',
    host: getHost(),
  })
  .useReactNative({
    networking: {
      ignoreUrls: /symbolicate/,
    },
  })
  .connect();

// Hacer disponible Reactotron globalmente
// @ts-ignore
console.tron = reactotron;

// Función para crear un middleware que registre cambios en Reactotron
export const createReactotronLogger =
  <T extends object>(storeName: string) =>
  (config: StateCreator<T, [], []>) =>
  (set: any, get: any, api: StoreApi<T>) => {
    // Registrar estado inicial cuando se crea el store
    const initialState = config(
      // Wrapper para set que registra cambios
      (args) => {
        const prevState = get();

        // Aplicar el cambio
        const result = set(args);

        // Obtener el nuevo estado
        const newState = get();

        // Calcular qué cambió
        const changes =
          typeof args === 'function'
            ? calculateChanges(prevState, newState)
            : args;

        // Registrar en Reactotron
        reactotron.display({
          name: `ZUSTAND [${storeName}]`,
          preview: getChangePreview(changes),
          value: {
            previous: prevState,
            changes,
            current: newState,
          },
        });

        return result;
      },
      get,
      api,
    );

    // Registrar el estado inicial
    reactotron.display({
      name: `ZUSTAND [${storeName}] - INITIAL STATE`,
      preview: storeName,
      value: initialState,
    });

    return initialState;
  };

// Función para crear un middleware de Zustand para monitoreo
export const withReactotron = <T extends object>(
  storeName: string,
  config: (set: any, get: any, api: any) => T,
): ((set: any, get: any, api: any) => T) => {
  return (set, get, api) => {
    // Crear una versión personalizada de set que registra cambios
    const trackedSet: typeof set = (args: any) => {
      const prevState = get();

      // Aplicar el cambio
      const result = set(args);

      // Obtener el nuevo estado
      const newState = get();

      // Calcular qué cambió
      const changes =
        typeof args === 'function'
          ? calculateChanges(prevState, newState)
          : args;

      // Registrar en Reactotron
      reactotron.display({
        name: `ZUSTAND [${storeName}]`,
        preview: getChangePreview(changes),
        value: {
          previous: prevState,
          changes,
          current: newState,
        },
      });

      return result;
    };

    // Inicializar el store con el set trackeado
    const state = config(trackedSet, get, api);

    // Registrar el estado inicial
    reactotron.display({
      name: `ZUSTAND [${storeName}] - INITIAL STATE`,
      preview: storeName,
      value: state,
    });

    return state;
  };
};

// Función para calcular los cambios entre estados
const calculateChanges = (prevState: any, newState: any) => {
  const changes: Record<string, any> = {};

  // Comparar cada propiedad de primer nivel
  Object.keys(newState).forEach((key) => {
    if (newState[key] !== prevState[key]) {
      changes[key] = newState[key];
    }
  });

  return changes;
};

// Obtener una vista preview de los cambios
const getChangePreview = (changes: any): string => {
  const keys = Object.keys(changes);
  if (keys.length === 0) return 'No changes';
  if (keys.length === 1) return `${keys[0]} changed`;
  return `${keys.length} properties changed`;
};

// Comandos personalizados para monitoreo
reactotron.onCustomCommand({
  command: 'zustand:reset',
  handler: () => {
    reactotron.log('Todos los stores serán reiniciados en la próxima recarga');
    AsyncStorage.clear();
  },
  title: 'Reset All Stores',
  description: 'Clears AsyncStorage and resets all Zustand stores',
});

export default reactotron;
