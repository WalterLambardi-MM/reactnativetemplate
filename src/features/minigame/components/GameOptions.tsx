import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { PokemonBasic } from '../../pokemon/types/types';

interface GameOptionsProps {
  options: PokemonBasic[];
  selectedOption?: number;
  correctOption?: number;
  onSelect: (index: number) => void;
  disabled?: boolean;
}

export const GameOptions: React.FC<GameOptionsProps> = ({
  options,
  selectedOption,
  correctOption,
  onSelect,
  disabled = false,
}) => {
  const renderOption = ({
    item,
    index,
  }: {
    item: PokemonBasic;
    index: number;
  }) => {
    // Determinar el estilo del botón según la selección y corrección
    let buttonStyle = { ...styles.optionButton };
    let textStyle = { ...styles.optionText };

    if (selectedOption !== undefined) {
      if (selectedOption === -1) {
        // Tiempo agotado, solo resaltar la opción correcta
        if (correctOption !== undefined && index === correctOption) {
          buttonStyle = { ...buttonStyle, ...styles.correctOption };
        }
      } else if (index === selectedOption) {
        if (correctOption !== undefined && index === correctOption) {
          // Opción seleccionada y correcta
          buttonStyle = { ...buttonStyle, ...styles.correctOption };
        } else {
          // Opción seleccionada pero incorrecta
          buttonStyle = { ...buttonStyle, ...styles.incorrectOption };
        }
      } else if (correctOption !== undefined && index === correctOption) {
        // Opción correcta pero no seleccionada
        buttonStyle = { ...buttonStyle, ...styles.correctOption };
      }
    }

    return (
      <TouchableOpacity
        style={buttonStyle}
        onPress={() => onSelect(index)}
        disabled={disabled || selectedOption !== undefined}
      >
        <Text style={textStyle}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={options}
        renderItem={renderOption}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.optionsContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 20,
  },
  optionsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButton: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    margin: 8,
    borderRadius: 8,
    minWidth: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  correctOption: {
    backgroundColor: '#4caf50',
    borderColor: '#388e3c',
  },
  incorrectOption: {
    backgroundColor: '#f44336',
    borderColor: '#d32f2f',
  },
});
