import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

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

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 16,
    color: '#c62828',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#c62828',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
