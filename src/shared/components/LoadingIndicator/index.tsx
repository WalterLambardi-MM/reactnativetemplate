import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import styles from './styles';

export const LoadingIndicator: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#f44336" />
    </View>
  );
};
