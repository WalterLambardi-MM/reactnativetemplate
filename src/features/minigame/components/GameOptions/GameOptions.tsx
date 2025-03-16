import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { PokemonBasic } from '../../../pokemon/types/pokemon.types';
import styles from './styles';

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
