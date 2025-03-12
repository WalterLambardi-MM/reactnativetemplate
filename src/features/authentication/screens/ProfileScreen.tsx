import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useAuthStore } from '../store/authStore';

export const ProfileScreen: React.FC = () => {
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
    } catch (error) {
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
    } catch (error) {
      // El error ya se maneja en el store y se actualiza a través de la suscripción
    } finally {
      setIsLoading(false);
    }
  }, [displayName]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Mi Perfil</Text>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          {user?.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {displayName?.charAt(0)?.toUpperCase() ||
                  user?.email?.charAt(0)?.toUpperCase() ||
                  '?'}
              </Text>
            </View>
          )}
        </View>

        {/* Información del usuario */}
        <View style={styles.infoContainer}>
          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* Nombre */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Nombre</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Tu nombre"
                editable={!isLoading}
              />
            ) : (
              <Text style={styles.value}>
                {user?.displayName || 'Sin nombre'}
              </Text>
            )}
          </View>

          {/* Email */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Correo Electrónico</Text>
            <Text style={styles.value}>{user?.email}</Text>
          </View>

          {/* Estado de verificación */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Estado</Text>
            <Text
              style={[
                styles.value,
                user?.emailVerified ? styles.verified : styles.unverified,
              ]}
            >
              {user?.emailVerified ? 'Verificado' : 'No verificado'}
            </Text>
          </View>

          {/* Botones de acción */}
          <View style={styles.buttonsContainer}>
            {isEditing ? (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCancel}
                  disabled={isLoading}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSave}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Guardar</Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.editButton]}
                  onPress={handleEdit}
                  disabled={isLoading}
                >
                  <Text style={styles.editButtonText}>Editar Perfil</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.logoutButton]}
                  onPress={handleLogout}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Cerrar Sesión</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#c62828',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    fontWeight: '500',
  },
  verified: {
    color: 'green',
  },
  unverified: {
    color: 'orange',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#c62828',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  logoutButton: {
    backgroundColor: '#c62828',
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
});
