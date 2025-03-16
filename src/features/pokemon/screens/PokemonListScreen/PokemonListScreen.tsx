import React from 'react';
import { View } from 'react-native';
import { usePokemonListViewModel } from '../../hooks/usePokemonListViewModel';
import { LoadingIndicator, ErrorView } from '../../../../shared/components';
import { PokemonList } from '../../components/PokemonList/PokemonList';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import styles from './styles';

export const PokemonListScreen: React.FC = () => {
  const {
    displayedPokemon,
    isLoading,
    isLoadingMore,
    error,
    searchQuery,
    totalCount,
    pokemonList,
    hasMore,
    handleEndReached,
    handlePokemonPress,
    handleSearchChange,
    handleClearSearch,
    refetch,
    isInitialized,
  } = usePokemonListViewModel();

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
      <PokemonList
        data={displayedPokemon}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        totalCount={totalCount}
        pokemonCount={pokemonList.length}
        searchQuery={searchQuery}
        onEndReached={handleEndReached}
        onPokemonPress={handlePokemonPress}
        onRefresh={refetch}
        refreshing={isLoading && pokemonList.length > 0}
        ListHeaderComponent={
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearchChange}
            onClear={handleClearSearch}
          />
        }
      />
    </View>
  );
};
