import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { RootStackParamList } from '../shared/types/navigation.types';
import { useAuthStore } from '../features/authentication';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const RootStack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { user, isLoading, initialize, cleanup } = useAuthStore();

  useEffect(() => {
    initialize();

    return () => {
      cleanup();
    };
  }, [initialize, cleanup]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#f44336" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <RootStack.Screen name="Main" component={MainNavigator} />
          ) : (
            <RootStack.Screen name="Auth" component={AuthNavigator} />
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
