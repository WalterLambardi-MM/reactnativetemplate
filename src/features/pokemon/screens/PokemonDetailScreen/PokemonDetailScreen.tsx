import React from 'react';
import { ScrollView } from 'react-native';
import { usePokemonDetailViewModel } from '../../hooks/usePokemonDetailViewModel';
import { LoadingIndicator, ErrorView } from '../../../../shared/components';
import { PokemonDetailView } from '../../components/PokemonDetailView/PokemonDetailView';
import styles from './styles';

export const PokemonDetailScreen: React.FC = () => {
  const {
    pokemon,
    isLoading,
    error,
    isFavorite,
    handleToggleFavorite,
    handleRetry,
  } = usePokemonDetailViewModel();

  if (isLoading && !pokemon) {
    return <LoadingIndicator />;
  }

  if (error && !pokemon) {
    return <ErrorView message={error} onRetry={handleRetry} />;
  }

  if (!pokemon) {
    return (
      <ErrorView message="No se pudo cargar el Pokémon" onRetry={handleRetry} />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <PokemonDetailView
        pokemon={pokemon}
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
      />
    </ScrollView>
  );
};
