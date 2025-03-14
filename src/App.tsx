import React, { useEffect } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { AppNavigator } from './navigation/AppNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { isFirebaseInitialized } from './config/firebase';

export default function App() {
  useEffect(() => {
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
