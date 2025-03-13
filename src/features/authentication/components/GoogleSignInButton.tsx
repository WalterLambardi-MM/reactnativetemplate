import React, { useState, useCallback } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  View,
} from 'react-native';
import { useAuthStore } from '../store/authStore';

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginWithProvider = useAuthStore((state) => state.loginWithProvider);

  const handleGoogleSignIn = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      await loginWithProvider('google');
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Error al iniciar sesión con Google';
      console.error('Error al iniciar sesión con Google:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [loginWithProvider, onSuccess, isLoading]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={handleGoogleSignIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#444" />
        ) : (
          <>
            <Image
              source={require('../../../../assets/google.png')}
              style={styles.icon}
            />
            <Text style={styles.text}>Continuar con Google</Text>
          </>
        )}
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  text: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
});
