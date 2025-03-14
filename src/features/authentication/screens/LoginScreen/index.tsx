import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { AuthForm } from '../../components/AuthForm';
import { GoogleSignInButton } from '../../components/GoogleSignInButton';
import { useLoginViewModel } from '../../hooks/useLoginViewModel';
import styles from './styles';

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
