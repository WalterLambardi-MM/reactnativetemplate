import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';

interface HeaderProfileButtonProps {
  onPress: () => void;
}

export const HeaderProfileButton: React.FC<HeaderProfileButtonProps> = ({
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Icon name="person" size={24} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    marginRight: 5,
  },
});
