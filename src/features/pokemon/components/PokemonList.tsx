import React from 'react';
import {
  FlatList,
  Text,
  ActivityIndicator,
  View,
  StyleSheet,
} from 'react-native';
import { PokemonBasic } from '../types/pokemon.types';
import { PokemonCard } from './PokemonCard';

interface PokemonListProps {
  data: PokemonBasic[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  totalCount: number;
  pokemonCount: number;
  searchQuery: string;
  onEndReached: () => void;
  onPokemonPress: (pokemon: PokemonBasic) => void;
  onRefresh: () => void;
  refreshing: boolean;
  ListHeaderComponent: React.ReactElement;
}

export const PokemonList: React.FC<PokemonListProps> = ({
  data,
  isLoading,
  isLoadingMore,
  hasMore,
  totalCount,
  pokemonCount,
  searchQuery,
  onEndReached,
  onPokemonPress,
  onRefresh,
  refreshing,
  ListHeaderComponent,
}) => {
  const renderPokemonItem = ({ item }: { item: PokemonBasic }) => (
    <PokemonCard pokemon={item} onPress={() => onPokemonPress(item)} />
  );

  // Renderizar el footer con indicador de carga o información
  const renderFooter = () => {
    if (searchQuery) return null;

    if (isLoadingMore) {
      return (
        <View style={styles.footerLoading}>
          <ActivityIndicator size="small" color="#3498db" />
          <Text style={styles.footerText}>Cargando más Pokémon...</Text>
        </View>
      );
    }

    if (pokemonCount > 0) {
      return (
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {hasMore
              ? `Mostrando ${pokemonCount} de ${totalCount} Pokémon`
              : `Has visto todos los ${pokemonCount} Pokémon`}
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={ListHeaderComponent}
      stickyHeaderHiddenOnScroll
      stickyHeaderIndices={[0]}
      data={data}
      renderItem={renderPokemonItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={
        <Text style={styles.emptyText}>
          {searchQuery
            ? 'No se encontraron Pokémon'
            : 'No hay Pokémon disponibles'}
        </Text>
      }
      onRefresh={onRefresh}
      refreshing={refreshing}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.3}
      ListFooterComponent={renderFooter}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerLoading: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
});
