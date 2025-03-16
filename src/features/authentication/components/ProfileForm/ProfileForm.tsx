import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
} from 'react-native';
import { User } from '../../types/auth.types';
import styles from './styles';

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
