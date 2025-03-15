import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { ProfileForm } from '../../components/ProfileForm';
import { useProfileViewModel } from '../../hooks/useProfileViewModel';
import { LoadingIndicator } from '../../../../shared/components';
import styles from './styles';

export const ProfileScreen = () => {
  const {
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
  } = useProfileViewModel();

  if (isLoading && !user) {
    return <LoadingIndicator />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Mi Perfil</Text>

        <ProfileForm
          user={user}
          error={error}
          isEditing={isEditing}
          isLoading={isLoading}
          displayName={displayName}
          onDisplayNameChange={handleDisplayNameChange}
          onEdit={handleEdit}
          onCancel={handleCancel}
          onSave={handleSave}
          onLogout={handleLogout}
        />
      </View>
    </SafeAreaView>
  );
};
