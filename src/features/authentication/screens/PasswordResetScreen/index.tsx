import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthForm } from '../../components/AuthForm';
import styles from './styles';

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
