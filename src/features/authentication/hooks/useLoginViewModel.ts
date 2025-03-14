import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';

export const useLoginViewModel = () => {
  const navigation = useNavigation();

  const handleRegisterPress = useCallback(() => {
    navigation.navigate('Register' as never);
  }, [navigation]);

  const handleForgotPassword = useCallback(() => {
    navigation.navigate('PasswordReset' as never);
  }, [navigation]);

  const handleLoginSuccess = useCallback(() => {
    // La navegación a la pantalla principal se manejará en el navegador principal
    // basado en el estado de autenticación
  }, []);

  return {
    handleRegisterPress,
    handleForgotPassword,
    handleLoginSuccess,
  };
};
