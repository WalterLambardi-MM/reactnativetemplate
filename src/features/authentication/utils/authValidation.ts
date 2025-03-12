import { AuthFormState } from '../types/auth.types';

export interface ValidationErrors {
  email?: string;
  password?: string;
  displayName?: string;
  confirmPassword?: string;
}

export const validateLoginForm = (data: AuthFormState): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Validar email
  if (!data.email) {
    errors.email = 'El correo electrónico es requerido';
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'El correo electrónico no es válido';
  }

  // Validar contraseña
  if (!data.password) {
    errors.password = 'La contraseña es requerida';
  }

  return errors;
};

export const validateRegisterForm = (data: AuthFormState): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Validar email
  if (!data.email) {
    errors.email = 'El correo electrónico es requerido';
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'El correo electrónico no es válido';
  }

  // Validar contraseña
  if (!data.password) {
    errors.password = 'La contraseña es requerida';
  } else if (data.password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres';
  }

  // Validar confirmación de contraseña
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden';
  }

  return errors;
};

export const validateResetPasswordForm = (email: string): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Validar email
  if (!email) {
    errors.email = 'El correo electrónico es requerido';
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = 'El correo electrónico no es válido';
  }

  return errors;
};
