import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { AuthForm } from '../components/AuthForm';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import { useLoginViewModel } from '../hooks/useLoginViewModel';

export const LoginScreen = () => {
  const { handleRegisterPress, handleForgotPassword, handleLoginSuccess } =
    useLoginViewModel();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>PokéApp</Text>

        <AuthForm type="login" onSuccess={handleLoginSuccess} />

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>O</Text>
          <View style={styles.divider} />
        </View>

        <GoogleSignInButton onSuccess={handleLoginSuccess} />

        <View style={styles.links}>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>¿No tienes cuenta?</Text>
            <TouchableOpacity onPress={handleRegisterPress}>
              <Text style={[styles.linkText, styles.registerLink]}>
                Regístrate
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
    marginBottom: 40,
    color: '#c62828',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
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
  links: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#c62828',
    fontSize: 16,
  },
  registerContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  registerText: {
    fontSize: 16,
    marginRight: 5,
  },
  registerLink: {
    fontWeight: 'bold',
  },
});
