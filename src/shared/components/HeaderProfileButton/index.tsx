import React from 'react';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';

interface HeaderProfileButtonProps {
  onPress: () => void;
}

export const HeaderProfileButton: React.FC<HeaderProfileButtonProps> = ({
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ padding: 5 }}>
      <Icon name="person" size={24} color="#fff" />
    </TouchableOpacity>
  );
};
