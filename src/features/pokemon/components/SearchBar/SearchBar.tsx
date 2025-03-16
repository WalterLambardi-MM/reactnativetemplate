import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import styles from './styles';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onClear,
}) => {
  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar Pokémon..."
        value={value}
        onChangeText={onChangeText}
      />
      {value ? (
        <TouchableOpacity style={styles.clearButton} onPress={onClear}>
          <Text>×</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
