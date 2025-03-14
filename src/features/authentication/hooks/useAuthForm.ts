import { useCallback } from 'react';
import { AuthFormState } from '../types/auth.types';
import { useAuthStore } from '../store/authStore';
import { ValidationFormType, validateAuthForm } from '../utils/authValidation';
import { useForm } from '../../../shared/hooks';

interface UseAuthFormProps {
  initialState: AuthFormState;
  formType: 'login' | 'register' | 'reset';
}

/**
 * Hook especializado para formularios de autenticación.
 * Utiliza el hook genérico useForm y lo adapta para casos específicos de autenticación.
 */
export function useAuthForm({ initialState, formType }: UseAuthFormProps) {
  const { login, register, resetPassword, error, clearError, isLoading } =
    useAuthStore();

  // Crear la función validadora específica para este tipo de formulario
  const validator = useCallback(
    (data: AuthFormState) =>
      validateAuthForm(data, formType as ValidationFormType) as Record<
        string,
        string
      >,
    [formType],
  );

  // Función de envío específica según el tipo de formulario
  const handleFormSubmit = useCallback(
    async (values: AuthFormState) => {
      try {
        switch (formType) {
          case 'login':
            await login({
              email: values.email,
              password: values.password,
            });
            break;
          case 'register':
            await register({
              email: values.email,
              password: values.password,
              displayName: values.displayName,
            });
            break;
          case 'reset':
            await resetPassword(values.email);
            break;
        }
        return !error; // Retorna true si no hay error
      } catch (err) {
        console.error(`Error en ${formType}:`, err);
        return false;
      }
    },
    [formType, login, register, resetPassword, error],
  );

  // Usar el hook genérico con nuestra configuración específica
  const form = useForm<AuthFormState, Record<string, string>>({
    initialValues: initialState,
    validator,
    onSubmit: handleFormSubmit,
  });

  // Métodos específicos para autenticación
  const handleLogin = useCallback(async () => {
    if (formType !== 'login') {
      console.error('handleLogin llamado en un formulario que no es de login');
      return false;
    }
    return form.handleSubmit();
  }, [form, formType]);

  const handleRegister = useCallback(async () => {
    if (formType !== 'register') {
      console.error(
        'handleRegister llamado en un formulario que no es de registro',
      );
      return false;
    }
    return form.handleSubmit();
  }, [form, formType]);

  const handleResetPassword = useCallback(async () => {
    if (formType !== 'reset') {
      console.error(
        'handleResetPassword llamado en un formulario que no es de reset',
      );
      return false;
    }
    return form.handleSubmit();
  }, [form, formType]);

  return {
    ...form,
    storeError: error,
    isLoading,
    clearStoreError: clearError,
    handleLogin,
    handleRegister,
    handleResetPassword,
  };
}

export default useAuthForm;
