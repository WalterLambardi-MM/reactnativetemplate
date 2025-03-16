import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from './styles';

interface ErrorScreenProps {
  error: string;
  onGoHome: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  error,
  onGoHome,
}) => (
  <View style={styles.errorContainer}>
    <MaterialIcons name="error" size={48} color="#c62828" />
    <Text style={styles.errorText}>{error}</Text>
    <TouchableOpacity style={styles.button} onPress={onGoHome}>
      <Text style={styles.buttonText}>Volver al Inicio</Text>
    </TouchableOpacity>
  </View>
);
