import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { AuthFormState } from '../types/auth.types';
import { useAuthStore } from '../store/authStore';

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
  // Obtener funciones del store directamente para evitar re-renderizados
  const authStore = useRef(useAuthStore.getState());

  // Estados locales
  const [formState, setFormState] = useState<AuthFormState>({
    email: initialValues.email || '',
    password: initialValues.password || '',
    ...(type === 'register'
      ? {
          displayName: initialValues.displayName || '',
          confirmPassword: initialValues.confirmPassword || '',
        }
      : {}),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [storeError, setStoreError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Suscribirse a cambios en el estado de loading y error
  useEffect(() => {
    // Obtener estado inicial
    setIsLoading(authStore.current.isLoading);
    setStoreError(authStore.current.error);

    // Suscribirse a cambios
    const unsubscribe = useAuthStore.subscribe((state) => {
      setIsLoading(state.isLoading);
      setStoreError(state.error);
    });

    return unsubscribe;
  }, []);

  // Manejar cambios en los campos
  const handleChange = useCallback(
    (field: keyof AuthFormState, value: string) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
      // Limpiar error cuando el usuario escribe
      setErrors((prev) => ({ ...prev, [field]: '' }));
      // Limpiar error del store
      authStore.current.clearError();
    },
    [],
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
    if (type !== 'reset') {
      if (!formState.password) {
        newErrors.password = 'La contraseña es requerida';
      } else if (formState.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      }
    }

    // Validar confirmación de contraseña (solo para registro)
    if (
      type === 'register' &&
      formState.confirmPassword !== formState.password
    ) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formState, type]);

  // Manejar envío del formulario
  const handleSubmit = useCallback(async () => {
    if (isSubmitting || isLoading) return;

    if (!validate()) return;

    setIsSubmitting(true);
    let success = false;

    try {
      if (type === 'login') {
        await authStore.current.login({
          email: formState.email,
          password: formState.password,
        });
        success = !authStore.current.error;
      } else if (type === 'register') {
        await authStore.current.register({
          email: formState.email,
          password: formState.password,
          displayName: formState.displayName,
        });
        success = !authStore.current.error;
      } else if (type === 'reset') {
        await authStore.current.resetPassword(formState.email);
        success = !authStore.current.error;
      }

      if (success && onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error en el envío del formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formState, type, isSubmitting, isLoading, validate, onSuccess]);

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
            editable={!isLoading && !isSubmitting}
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
          editable={!isLoading && !isSubmitting}
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
            editable={!isLoading && !isSubmitting}
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
            editable={!isLoading && !isSubmitting}
          />
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}
        </View>
      )}

      {/* Botón de envío */}
      <TouchableOpacity
        style={[
          styles.button,
          (isLoading || isSubmitting) && styles.buttonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={isLoading || isSubmitting}
      >
        {isLoading || isSubmitting ? (
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

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#c62828',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 4,
  },
});
