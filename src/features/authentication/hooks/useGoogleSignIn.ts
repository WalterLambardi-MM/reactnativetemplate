import { useState, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';

export const useGoogleSignIn = (onSuccess?: () => void) => {
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

  return {
    isLoading,
    error,
    handleGoogleSignIn,
  };
};
