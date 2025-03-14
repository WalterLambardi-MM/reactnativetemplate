import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { usePokemonDetail } from '../../hooks/hooks';
import { LoadingIndicator, ErrorView } from '../../../../shared/components';
import styles from './styles';
import {
  formatStatName,
  getStatColor,
  getTypeColor,
} from '../../utils/pokemonUtils';
import { MaterialIcons } from '@expo/vector-icons';

type RouteParams = {
  PokemonDetail: {
    id: number;
  };
};

export const PokemonDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<RouteParams, 'PokemonDetail'>>();
  const { id } = route.params;

  const { pokemon, isLoading, error, isFavorite, toggleFavorite, refetch } =
    usePokemonDetail(id);

  if (isLoading && !pokemon) {
    return <LoadingIndicator />;
  }

  if (error && !pokemon) {
    return <ErrorView message={error} onRetry={refetch} />;
  }

  if (!pokemon) {
    return (
      <ErrorView message="No se pudo cargar el Pokémon" onRetry={refetch} />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: pokemon.imageUrl }} style={styles.image} />
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{pokemon.name}</Text>
          <Text style={styles.id}>
            #{pokemon.id.toString().padStart(3, '0')}
          </Text>
        </View>
        <TouchableOpacity
          onPress={toggleFavorite}
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
    </ScrollView>
  );
};
