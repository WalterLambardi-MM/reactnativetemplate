import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { AuthFormState } from '../../types/auth.types';
import { useAuthForm } from '../../hooks/useAuthForm';
import styles from './styles';

interface AuthFormProps {
  type: 'login' | 'register' | 'reset';
  onSuccess?: () => void;
  initialValues?: Partial<AuthFormState>;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  type,
  onSuccess,
  initialValues = {},
}) => {
  // Crear estado inicial completo basado en el tipo y valores iniciales
  const initialState: AuthFormState = {
    email: initialValues.email || '',
    password: initialValues.password || '',
    ...(type === 'register'
      ? {
          displayName: initialValues.displayName || '',
          confirmPassword: initialValues.confirmPassword || '',
        }
      : {}),
  };

  // Usar el hook useAuthForm para toda la lógica del formulario
  const {
    values: formState,
    errors,
    storeError,
    isLoading,
    isSubmitting,
    handleChange,
    handleSubmit,
  } = useAuthForm({
    initialState,
    formType: type,
  });

  // Estado local para controlar el estado de envío adicional si es necesario
  const [localSubmitting, setLocalSubmitting] = useState(false);

  // Manejar envío del formulario
  const handleFormSubmit = async () => {
    if (localSubmitting || isSubmitting || isLoading) return;

    setLocalSubmitting(true);
    try {
      const success = await handleSubmit();
      if (success && onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error en el envío del formulario:', error);
    } finally {
      setLocalSubmitting(false);
    }
  };

  // Determinar si el formulario está en proceso de envío
  const formIsSubmitting = isSubmitting || localSubmitting || isLoading;

  return (
    <View style={styles.container}>
      {/* Título del formulario */}
      <Text style={styles.title}>
        {type === 'login'
          ? 'Iniciar Sesión'
          : type === 'register'
            ? 'Crear Cuenta'
            : 'Restablecer Contraseña'}
      </Text>

      {/* Error general del store */}
      {storeError && <Text style={styles.errorText}>{storeError}</Text>}

      {/* Campo de nombre (solo para registro) */}
      {type === 'register' && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            placeholder="Tu nombre"
            value={formState.displayName}
            onChangeText={(value) => handleChange('displayName', value)}
            autoCapitalize="words"
            editable={!formIsSubmitting}
          />
          {errors.displayName && (
            <Text style={styles.errorText}>{errors.displayName}</Text>
          )}
        </View>
      )}

      {/* Campo de email */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="correo@ejemplo.com"
          value={formState.email}
          onChangeText={(value) => handleChange('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!formIsSubmitting}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      {/* Campo de contraseña (no para reset) */}
      {type !== 'reset' && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={formState.password}
            onChangeText={(value) => handleChange('password', value)}
            secureTextEntry
            editable={!formIsSubmitting}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
        </View>
      )}

      {/* Confirmar contraseña (solo para registro) */}
      {type === 'register' && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirmar Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirma tu contraseña"
            value={formState.confirmPassword}
            onChangeText={(value) => handleChange('confirmPassword', value)}
            secureTextEntry
            editable={!formIsSubmitting}
          />
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}
        </View>
      )}

      {/* Botón de envío */}
      <TouchableOpacity
        style={[styles.button, formIsSubmitting && styles.buttonDisabled]}
        onPress={handleFormSubmit}
        disabled={formIsSubmitting}
      >
        {formIsSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {type === 'login'
              ? 'Iniciar Sesión'
              : type === 'register'
                ? 'Registrarse'
                : 'Enviar Correo'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};
