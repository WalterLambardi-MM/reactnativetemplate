import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { Card } from '../../../shared/components';
import { PokemonBasic } from '../types/types';

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

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 5,
    padding: 15,
    alignItems: 'center',
  },
  pokemonImage: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  pokemonName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pokemonId: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
