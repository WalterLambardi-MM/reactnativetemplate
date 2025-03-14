import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthForm } from '../../components/AuthForm';
import { GoogleSignInButton } from '../../components/GoogleSignInButton';
import styles from './styles';

export const RegisterScreen = () => {
  const navigation = useNavigation();

  const handleLoginPress = () => {
    navigation.navigate('Login' as never);
  };

  const handleRegisterSuccess = () => {
    // La navegación a la pantalla principal se manejará en el navegador principal
    // basado en el estado de autenticación
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.logo}>PokéApp</Text>

        <AuthForm type="register" onSuccess={handleRegisterSuccess} />
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>O</Text>
          <View style={styles.divider} />
        </View>

        <GoogleSignInButton onSuccess={handleRegisterSuccess} />

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>¿Ya tienes cuenta?</Text>
          <TouchableOpacity onPress={handleLoginPress}>
            <Text style={styles.loginLink}>Inicia sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
