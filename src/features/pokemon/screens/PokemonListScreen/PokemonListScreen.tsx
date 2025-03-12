import React from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { usePokemonList, useSearchPokemon } from '../../hooks/hooks';
import {
  LoadingIndicator,
  ErrorView,
  Card,
} from '../../../../shared/components';
import { PokemonBasic } from '../../types/types';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';

export const PokemonListScreen: React.FC = () => {
  const {
    pokemonList,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    refetch,
    isInitialized,
    totalCount,
  } = usePokemonList();

  const { searchQuery, setSearchQuery, searchResults, clearSearch } =
    useSearchPokemon();
  const navigation = useNavigation();

  const displayedPokemon = searchQuery ? searchResults : pokemonList;

  // Manejar cuando se llega al final de la lista
  const handleEndReached = () => {
    if (!searchQuery && hasMore && !isLoadingMore) {
      loadMore();
    }
  };

  const renderPokemonItem = ({ item }: { item: PokemonBasic }) => (
    <Card style={styles.card}>
      <TouchableOpacity
        onPress={() => navigation.navigate('PokemonDetail', { id: item.id })}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.pokemonImage} />
        <Text style={styles.pokemonName}>{item.name}</Text>
        <Text style={styles.pokemonId}>
          #{item.id.toString().padStart(3, '0')}
        </Text>
      </TouchableOpacity>
    </Card>
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

    if (pokemonList.length > 0) {
      return (
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {hasMore
              ? `Mostrando ${pokemonList.length} de ${totalCount} Pokémon`
              : `Has visto todos los ${pokemonList.length} Pokémon`}
          </Text>
        </View>
      );
    }

    return null;
  };

  // Mostrar indicador de carga solo en la carga inicial
  if (isLoading && !isInitialized) {
    return <LoadingIndicator />;
  }

  // Mostrar error solo si no hay datos para mostrar
  if (error && pokemonList.length === 0) {
    return <ErrorView message={error} onRetry={refetch} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar Pokémon..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearSearch}
              >
                <Text>×</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        }
        stickyHeaderHiddenOnScroll
        stickyHeaderIndices={[0]}
        data={displayedPokemon}
        renderItem={renderPokemonItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {searchQuery
              ? 'No se encontraron Pokémon'
              : 'No hay Pokémon disponibles'}
          </Text>
        }
        onRefresh={refetch}
        refreshing={isLoading && pokemonList.length > 0}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};
