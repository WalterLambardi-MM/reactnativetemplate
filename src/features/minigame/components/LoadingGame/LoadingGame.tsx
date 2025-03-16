import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import styles from './styles';

export const LoadingGame: React.FC = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#c62828" />
    <Text style={styles.loadingText}>Cargando juego...</Text>
  </View>
);
