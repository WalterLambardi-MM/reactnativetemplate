import { useState, useCallback, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { useAuthStore } from '../store/auth.store';

export const useProfileViewModel = () => {
  // Usar useRef para acceder al store y evitar re-renderizados
  const authStoreRef = useRef(useAuthStore.getState());

  // Estados locales
  const [user, setUser] = useState(authStoreRef.current.user);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');

  // Suscribirse a cambios en el usuario y estado de carga
  useEffect(() => {
    const unsubscribe = useAuthStore.subscribe((state) => {
      setUser(state.user);
      setIsLoading(state.isLoading);
      setError(state.error);
    });

    return unsubscribe;
  }, []);

  // Actualizar displayName cuando cambie el usuario
  useEffect(() => {
    if (!isEditing) {
      setDisplayName(user?.displayName || '');
    }
  }, [user, isEditing]);

  // Manejar cierre de sesión
  const handleLogout = useCallback(async () => {
    try {
      setIsLoading(true);
      await authStoreRef.current.logout();
    } catch {
      Alert.alert('Error', 'No se pudo cerrar sesión. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Manejar edición
  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  // Manejar cancelación
  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setDisplayName(user?.displayName || '');
    authStoreRef.current.clearError();
    setError(null);
  }, [user]);

  // Manejar guardado
  const handleSave = useCallback(async () => {
    try {
      setIsLoading(true);
      await authStoreRef.current.updateProfile({ displayName });
      setIsEditing(false);
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
    } catch {
      // El error ya se maneja en el store y se actualiza a través de la suscripción
    } finally {
      setIsLoading(false);
    }
  }, [displayName]);

  // Manejar cambio de nombre
  const handleDisplayNameChange = useCallback((value: string) => {
    setDisplayName(value);
  }, []);

  return {
    user,
    isLoading,
    error,
    isEditing,
    displayName,
    handleEdit,
    handleCancel,
    handleSave,
    handleLogout,
    handleDisplayNameChange,
  };
};
