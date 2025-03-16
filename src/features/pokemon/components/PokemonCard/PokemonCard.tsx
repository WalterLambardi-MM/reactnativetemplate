import React from 'react';
import { TouchableOpacity, Text, Image } from 'react-native';
import { Card } from '../../../../shared/components';
import { PokemonBasic } from '../../types/pokemon.types';
import styles from './styles';

interface PokemonCardProps {
  pokemon: PokemonBasic;
  onPress: () => void;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  onPress,
}) => {
  return (
    <Card style={styles.card}>
      <TouchableOpacity onPress={onPress}>
        <Image source={{ uri: pokemon.imageUrl }} style={styles.pokemonImage} />
        <Text style={styles.pokemonName}>{pokemon.name}</Text>
        <Text style={styles.pokemonId}>
          #{pokemon.id.toString().padStart(3, '0')}
        </Text>
      </TouchableOpacity>
    </Card>
  );
};
