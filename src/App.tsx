import '../ReactotronConfig';
import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { Platform, StatusBar, StyleSheet } from 'react-native';
import { AppNavigator } from './navigation/AppNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { isFirebaseInitialized } from './config/firebase';

import reactotron from '../ReactotronConfig';


export default function App() {
  useEffect(() => {
    if (Platform.OS === 'android' && __DEV__) {
      // Enviar un log de prueba para verificar la conexión
      reactotron.log('App montada - Verificando conexión de Reactotron');
      
      // Programar logs periódicos para mantener la conexión activa
      const interval = setInterval(() => {
        reactotron.log('Heartbeat de conexión');
      }, 10000);
      
      return () => clearInterval(interval);
    }

    if (!isFirebaseInitialized()) {
      console.error(
        'Firebase initialization failed. Authentication will not work.',
      );
    }
  }, []);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <StatusBar backgroundColor="#c62828" barStyle="light-content" />
      <AppNavigator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
