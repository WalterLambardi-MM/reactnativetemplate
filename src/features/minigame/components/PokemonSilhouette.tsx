import React, { useState } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';

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
  const [loading, setLoading] = useState(true);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {loading && <ActivityIndicator size="large" color="#c62828" />}

      <Image
        source={{ uri: imageUrl }}
        style={[styles.image, !revealed && styles.silhouetteImage]}
        resizeMode="contain"
        onLoad={() => setLoading(false)}
        onError={() => {
          console.error('Error cargando imagen:', imageUrl);
          setLoading(false);
        }}
      />
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
  silhouetteBackground: {
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  silhouetteImage: {
    tintColor: '#000000', // Convierte la imagen en silueta negra
    opacity: 1,
  },
});
