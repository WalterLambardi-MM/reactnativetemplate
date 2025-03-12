import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { PokemonListScreen } from '../features/pokemon/screens/PokemonListScreen/PokemonListScreen';
import { PokemonDetailScreen } from '../features/pokemon/screens/PokemonDetailScreen/PokemonDetailScreen';
import { MainStackParamList } from './types';
import { HeaderProfileButton } from '../shared/components/HeaderProfileButton/HeaderProfileButton';
import { ProfileScreen } from '../features/authentication';

const MainStack = createStackNavigator<MainStackParamList>();

export const MainNavigator: React.FC = () => {
  return (
    <MainStack.Navigator
      initialRouteName="PokemonList"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f44336',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <MainStack.Screen
        name="PokemonList"
        component={PokemonListScreen}
        options={({ navigation }) => ({
          title: "Pokemon's Expo App",
          headerRight: () => (
            <View style={{ marginRight: 15 }}>
              <HeaderProfileButton
                onPress={() => navigation.navigate('Profile')}
              />
            </View>
          ),
        })}
      />
      <MainStack.Screen
        name="PokemonDetail"
        component={PokemonDetailScreen}
        options={({ route }) => ({
          title: `Pokémon #${route.params?.id || ''}`,
        })}
      />
      <MainStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Mi Perfil' }}
      />
    </MainStack.Navigator>
  );
};
