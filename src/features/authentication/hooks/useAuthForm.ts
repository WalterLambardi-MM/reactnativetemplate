import { useState, useCallback } from 'react';
import { AuthFormState } from '../types/auth.types';
import { useAuthStore } from '../store/authStore';

export function useAuthForm(initialState: AuthFormState) {
  const [formState, setFormState] = useState<AuthFormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { login, register, resetPassword, error, clearError } = useAuthStore();

  // Manejar cambios en los campos
  const handleChange = useCallback(
    (field: keyof AuthFormState, value: string) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
      // Limpiar error cuando el usuario escribe
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: '' }));
      }
      clearError();
    },
    [errors, clearError],
  );

  // Validar el formulario
  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};

    // Validar email
    if (!formState.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }

    // Validar contraseña (solo si se requiere)
    if ('password' in formState && formState.password === '') {
      newErrors.password = 'La contraseña es requerida';
    } else if ('password' in formState && formState.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar confirmación de contraseña (solo para registro)
    if (
      'confirmPassword' in formState &&
      formState.confirmPassword !== formState.password
    ) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formState]);

  // Manejar inicio de sesión
  const handleLogin = useCallback(async () => {
    if (!validate()) return;

    try {
      await login({
        email: formState.email,
        password: formState.password,
      });
    } catch (err) {
      // El error ya se maneja en el store
      console.error(err);
    }
  }, [formState, login, validate]);

  // Manejar registro
  const handleRegister = useCallback(async () => {
    if (!validate()) return;

    try {
      await register({
        email: formState.email,
        password: formState.password,
        displayName: formState.displayName,
      });
    } catch (err) {
      // El error ya se maneja en el store
      console.error(err);
    }
  }, [formState, register, validate]);

  // Manejar restablecimiento de contraseña
  const handleResetPassword = useCallback(async () => {
    // Validar solo el email
    if (!formState.email) {
      setErrors({ email: 'El correo electrónico es requerido' });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formState.email)) {
      setErrors({ email: 'El correo electrónico no es válido' });
      return;
    }

    try {
      await resetPassword(formState.email);
      return true; // Indicar éxito para mostrar mensaje
    } catch (err) {
      // El error ya se maneja en el store
      console.error(err);
      return false;
    }
  }, [formState.email, resetPassword]);

  return {
    formState,
    errors,
    storeError: error,
    handleChange,
    handleLogin,
    handleRegister,
    handleResetPassword,
    clearError,
  };
}
