import React from 'react';
import { PokemonImage } from '../PokemonImage/PokemonImage';

interface PokemonSilhouetteProps {
  imageUrl: string;
  size?: number;
  revealed?: boolean;
}

export const PokemonSilhouette: React.FC<PokemonSilhouetteProps> = ({
  imageUrl,
  size = 200,
  revealed = false,
}) => {
  return <PokemonImage imageUrl={imageUrl} size={size} revealed={revealed} />;
};
