import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { PokemonDetail } from '../../types/pokemon.types';
import {
  formatStatName,
  getStatColor,
  getTypeColor,
} from '../../utils/pokemonUtils';
import styles from './styles';

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
