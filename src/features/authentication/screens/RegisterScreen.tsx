import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthForm } from '../components/AuthForm';
import { GoogleSignInButton } from '../components/GoogleSignInButton';

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
  loginContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 16,
    marginRight: 5,
  },
  loginLink: {
    color: '#c62828',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#666',
  },
});
