import { useCallback, useEffect, useState } from 'react';
import { usePokemonStore } from '../store/pokemon.store';
import { pokemonService } from '../services/pokemonApi';
import { PokemonBasic } from '../types/pokemon.types';
import { ApiError } from '../../../shared/api/error-handling';
import { DEFAULT_PAGE_SIZE } from '../../../shared/constants/api';

// Caso de uso: Listar Pokémon paginado
export const usePokemonList = () => {
  // Estado del store
  const {
    totalCount,
    isLoading,
    error,
    setPokemonList,
    setLoading,
    setError,
    clearError,
  } = usePokemonStore();

  // Estado local para la paginación
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allPokemon, setAllPokemon] = useState<PokemonBasic[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Función para cargar la primera página
  const fetchInitialPokemon = useCallback(async () => {
    setLoading(true);
    clearError();
    setPage(1);

    try {
      const { results, count } = await pokemonService.getList(
        DEFAULT_PAGE_SIZE,
        0,
      );

      setAllPokemon(results);
      setPokemonList(results, count);
      setHasMore(results.length < count);
      setIsInitialized(true);
    } catch (err) {
      console.error('Error fetching initial Pokemon:', err);
      const message =
        err instanceof ApiError
          ? `Error ${err.statusCode}: ${err.message}`
          : 'Error al cargar Pokémon';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [setPokemonList, setLoading, setError, clearError]);

  // Función para cargar más Pokémon
  const fetchMorePokemon = useCallback(async () => {
    // No cargar más si ya estamos cargando o no hay más
    if (isLoadingMore || !hasMore || isLoading) return;

    setIsLoadingMore(true);
    const nextPage = page + 1;
    const offset = (nextPage - 1) * DEFAULT_PAGE_SIZE;

    try {
      console.log(`Loading more Pokemon: page ${nextPage}, offset ${offset}`);
      const { results, count } = await pokemonService.getList(
        DEFAULT_PAGE_SIZE,
        offset,
      );

      // Combinar con los Pokémon existentes
      const newAllPokemon = [...allPokemon, ...results];
      setAllPokemon(newAllPokemon);
      setPokemonList(newAllPokemon, count);

      // Actualizar estado de paginación
      setPage(nextPage);
      setHasMore(newAllPokemon.length < count);

      console.log(
        `Loaded ${results.length} more Pokemon. Total: ${newAllPokemon.length}/${count}`,
      );
    } catch (err) {
      console.error('Error fetching more Pokemon:', err);
      // No mostrar error en UI para carga de más, solo en consola
    } finally {
      setIsLoadingMore(false);
    }
  }, [page, allPokemon, isLoadingMore, hasMore, isLoading, setPokemonList]);

  // Cargar datos iniciales al montar
  useEffect(() => {
    if (!isInitialized) {
      fetchInitialPokemon();
    }
  }, [isInitialized, fetchInitialPokemon]);

  return {
    // Usar la lista combinada en lugar de la del store
    pokemonList: allPokemon,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore: fetchMorePokemon,
    refetch: fetchInitialPokemon,
    isInitialized,
    totalCount,
  };
};

// Caso de uso: Obtener detalle de Pokémon
export const usePokemonDetail = (idOrName: string | number) => {
  const {
    selectedPokemon,
    isLoading,
    error,
    setSelectedPokemon,
    setLoading,
    setError,
    clearError,
    favorites,
    toggleFavorite,
  } = usePokemonStore();

  const fetchPokemonDetail = useCallback(async () => {
    if (!idOrName) return;

    setLoading(true);
    clearError();

    try {
      const pokemonDetail = await pokemonService.getDetail(idOrName);
      setSelectedPokemon(pokemonDetail);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? `Error ${err.statusCode}: ${err.message}`
          : 'Error al cargar detalles del Pokémon';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [idOrName, setSelectedPokemon, setLoading, setError, clearError]);

  useEffect(() => {
    fetchPokemonDetail();

    // Limpiar al desmontar
    return () => {
      setSelectedPokemon(null);
    };
  }, [idOrName, fetchPokemonDetail, setSelectedPokemon]);

  const isFavorite = selectedPokemon
    ? favorites.includes(selectedPokemon.id)
    : false;

  return {
    pokemon: selectedPokemon,
    isLoading,
    error,
    isFavorite,
    toggleFavorite: selectedPokemon
      ? () => toggleFavorite(selectedPokemon.id)
      : () => {},
    refetch: fetchPokemonDetail,
  };
};

// Caso de uso: Buscar Pokémon
export const useSearchPokemon = () => {
  const [searchResults, setSearchResults] = useState<PokemonBasic[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const { pokemonList } = usePokemonList();

  const searchPokemon = useCallback(
    (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      // Búsqueda local en lugar de API
      const results = pokemonList.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(query.toLowerCase()),
      );

      setSearchResults(results);
    },
    [pokemonList],
  );

  // Debounce para la búsqueda
  useEffect(() => {
    const handler = setTimeout(() => {
      searchPokemon(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, searchPokemon]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    clearSearch: () => {
      setSearchQuery('');
      setSearchResults([]);
    },
  };
};
