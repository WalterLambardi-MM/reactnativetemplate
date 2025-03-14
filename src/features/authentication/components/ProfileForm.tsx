import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
} from 'react-native';
import { User } from '../types/auth.types';

interface ProfileFormProps {
  user: User | null;
  error: string | null;
  isEditing: boolean;
  isLoading: boolean;
  displayName: string;
  onDisplayNameChange: (name: string) => void;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onLogout: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  user,
  error,
  isEditing,
  isLoading,
  displayName,
  onDisplayNameChange,
  onEdit,
  onCancel,
  onSave,
  onLogout,
}) => {
  return (
    <>
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
              onChangeText={onDisplayNameChange}
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
                onPress={onCancel}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={onSave}
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
                onPress={onEdit}
                disabled={isLoading}
              >
                <Text style={styles.editButtonText}>Editar Perfil</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.logoutButton]}
                onPress={onLogout}
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
    </>
  );
};

const styles = StyleSheet.create({
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
