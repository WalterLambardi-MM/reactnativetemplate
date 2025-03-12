import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthForm } from '../components/AuthForm';

export const PasswordResetScreen = () => {
  const navigation = useNavigation();
  const [resetSent, setResetSent] = useState(false);

  const handleBackToLogin = () => {
    navigation.navigate('Login' as never);
  };

  const handleResetSuccess = () => {
    setResetSent(true);
    Alert.alert(
      'Correo enviado',
      'Se ha enviado un correo para restablecer tu contraseña',
      [{ text: 'OK' }],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>PokéApp</Text>

        {resetSent ? (
          <View style={styles.successContainer}>
            <Text style={styles.successTitle}>Correo Enviado</Text>
            <Text style={styles.successText}>
              Hemos enviado instrucciones para restablecer tu contraseña al
              correo proporcionado.
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleBackToLogin}>
              <Text style={styles.buttonText}>Volver al inicio de sesión</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.resetText}>
              Introduce tu correo electrónico y te enviaremos instrucciones para
              restablecer tu contraseña.
            </Text>

            <AuthForm type="reset" onSuccess={handleResetSuccess} />

            <TouchableOpacity
              style={styles.backLink}
              onPress={handleBackToLogin}
            >
              <Text style={styles.backText}>Volver al inicio de sesión</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#c62828',
  },
  resetText: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  backLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  backText: {
    color: '#c62828',
    fontSize: 16,
  },
  successContainer: {
    alignItems: 'center',
    padding: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  successText: {
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 16,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#c62828',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
