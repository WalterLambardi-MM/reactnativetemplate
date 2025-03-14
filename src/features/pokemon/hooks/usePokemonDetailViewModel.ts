import { useCallback } from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { usePokemonDetail } from './usePokemonHooks';

type RouteParams = {
  PokemonDetail: {
    id: number;
  };
};

export const usePokemonDetailViewModel = () => {
  const route = useRoute<RouteProp<RouteParams, 'PokemonDetail'>>();
  const { id } = route.params;

  const { pokemon, isLoading, error, isFavorite, toggleFavorite, refetch } =
    usePokemonDetail(id);

  const handleToggleFavorite = useCallback(() => {
    if (toggleFavorite) {
      toggleFavorite();
    }
  }, [toggleFavorite]);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    pokemon,
    isLoading,
    error,
    isFavorite,
    handleToggleFavorite,
    handleRetry,
  };
};
