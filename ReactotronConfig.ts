import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
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
