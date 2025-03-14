import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { PokemonDetail } from '../types/pokemon.types';
import {
  formatStatName,
  getStatColor,
  getTypeColor,
} from '../utils/pokemonUtils';

interface PokemonDetailViewProps {
  pokemon: PokemonDetail;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const PokemonDetailView: React.FC<PokemonDetailViewProps> = ({
  pokemon,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <>
      <View style={styles.header}>
        <Image source={{ uri: pokemon.imageUrl }} style={styles.image} />
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{pokemon.name}</Text>
          <Text style={styles.id}>
            #{pokemon.id.toString().padStart(3, '0')}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onToggleFavorite}
          style={styles.favoriteButton}
        >
          <MaterialIcons
            name={isFavorite ? 'star' : 'star-border'}
            size={32}
            color="#FFD700"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tipos</Text>
        <View style={styles.typesContainer}>
          {pokemon.types.map((type) => (
            <View
              key={type}
              style={[styles.typeTag, { backgroundColor: getTypeColor(type) }]}
            >
              <Text style={styles.typeText}>{type}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Altura</Text>
            <Text style={styles.infoValue}>{pokemon.height} m</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Peso</Text>
            <Text style={styles.infoValue}>{pokemon.weight} kg</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Habilidades</Text>
        <View style={styles.abilitiesContainer}>
          {pokemon.abilities.map((ability) => (
            <Text key={ability} style={styles.ability}>
              {ability.charAt(0).toUpperCase() + ability.slice(1)}
            </Text>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estadísticas</Text>
        {pokemon.stats.map((stat) => (
          <View key={stat.name} style={styles.statContainer}>
            <Text style={styles.statName}>{formatStatName(stat.name)}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
            <View style={styles.statBarContainer}>
              <View
                style={[
                  styles.statBar,
                  { width: `${Math.min(100, (stat.value / 255) * 100)}%` },
                  { backgroundColor: getStatColor(stat.value) },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  image: {
    width: 120,
    height: 120,
    marginRight: 15,
  },
  titleContainer: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  id: {
    fontSize: 16,
    color: '#666',
  },
  favoriteButton: {
    padding: 10,
  },
  section: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 5,
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  typeTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 5,
  },
  typeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  abilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ability: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    margin: 5,
  },
  statContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statName: {
    width: 80,
    fontSize: 14,
  },
  statValue: {
    width: 30,
    textAlign: 'right',
    marginRight: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  statBarContainer: {
    flex: 1,
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  statBar: {
    height: '100%',
  },
});
