import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Image,
  View,
} from 'react-native';
import { useGoogleSignIn } from '../../hooks/useGoogleSignIn';
import styles from './styles';

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
}) => {
  const { isLoading, error, handleGoogleSignIn } = useGoogleSignIn(onSuccess);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={handleGoogleSignIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#444" />
        ) : (
          <>
            <Image
              source={require('../../../../../assets/google.png')}
              style={styles.icon}
            />
            <Text style={styles.text}>Continuar con Google</Text>
          </>
        )}
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};
