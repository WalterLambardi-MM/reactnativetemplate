import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { usePokemonList, useSearchPokemon } from './usePokemonHooks';
import { PokemonBasic } from '../types/types';

export const usePokemonListViewModel = () => {
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
  const handleEndReached = useCallback(() => {
    if (!searchQuery && hasMore && !isLoadingMore) {
      loadMore();
    }
  }, [searchQuery, hasMore, isLoadingMore, loadMore]);

  // Manejar la selección de un Pokémon
  const handlePokemonPress = useCallback(
    (pokemon: PokemonBasic) => {
      navigation.navigate(
        'PokemonDetail' as never,
        { id: pokemon.id } as never,
      );
    },
    [navigation],
  );

  // Manejar cambio en la búsqueda
  const handleSearchChange = useCallback(
    (text: string) => {
      setSearchQuery(text);
    },
    [setSearchQuery],
  );

  // Manejar limpieza de búsqueda
  const handleClearSearch = useCallback(() => {
    clearSearch();
  }, [clearSearch]);

  return {
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
  };
};
