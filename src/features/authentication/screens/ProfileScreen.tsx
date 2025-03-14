import React from 'react';
import { View, StyleSheet, Text, SafeAreaView } from 'react-native';
import { ProfileForm } from '../components/ProfileForm';
import { useProfileViewModel } from '../hooks/useProfileViewModel';
import { LoadingIndicator } from '../../../shared/components';

export const ProfileScreen: React.FC = () => {
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
});
