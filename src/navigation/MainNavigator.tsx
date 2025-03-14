import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { PokemonListScreen } from '../features/pokemon/screens/PokemonListScreen/PokemonListScreen';
import { PokemonDetailScreen } from '../features/pokemon/screens/PokemonDetailScreen/PokemonDetailScreen';
import { ProfileScreen } from '../features/authentication/screens/ProfileScreen';
import { MinigameHomeScreen } from '../features/minigame/screens/MinigameHomeScreen';
import { WhosThatPokemonScreen } from '../features/minigame/screens/WhosThatPokemonScreen';
import { MainStackParamList } from '../shared/types/navigation.types';
import {
  HeaderProfileButton,
  HeaderMinigameButton,
} from '../shared/components';

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
            <View style={{ flexDirection: 'row' }}>
              <HeaderMinigameButton
                onPress={() => navigation.navigate('MinigameHome')}
              />
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
      <MainStack.Screen
        name="MinigameHome"
        component={MinigameHomeScreen}
        options={{ title: 'Minijuegos Pokémon' }}
      />
      <MainStack.Screen
        name="WhosThatPokemon"
        component={WhosThatPokemonScreen}
        options={{
          title: '¿Quién es ese Pokémon?',
          headerShown: false,
        }}
      />
    </MainStack.Navigator>
  );
};
