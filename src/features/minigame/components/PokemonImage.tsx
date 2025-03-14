import React, { useState } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';

interface PokemonImageProps {
  imageUrl: string;
  size: number;
  revealed: boolean;
}

export const PokemonImage: React.FC<PokemonImageProps> = ({
  imageUrl,
  size,
  revealed,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const handleError = () => {
    console.error('Error cargando imagen:', imageUrl);
    setLoading(false);
    setError(true);
  };

  const handleLoad = () => {
    setLoading(false);
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {loading && <ActivityIndicator size="large" color="#c62828" />}

      {!error && (
        <Image
          source={{ uri: imageUrl }}
          style={[styles.image, !revealed && styles.silhouetteImage]}
          resizeMode="contain"
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  silhouetteImage: {
    tintColor: '#000000',
  },
});
