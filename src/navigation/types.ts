import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import {
  GameDifficulty,
  GameType,
} from '../features/minigame/types/minigame.types';

// Tipos para el stack principal
export type MainStackParamList = {
  PokemonList: undefined;
  PokemonDetail: { id: number };
  Profile: undefined;
  MinigameHome: undefined;
  WhosThatPokemon: {
    gameType: GameType;
    difficulty: GameDifficulty;
    questionCount: number;
  };
};

// Tipos para el stack de autenticación
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  PasswordReset: undefined;
};

// Tipos para el stack raíz
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

// Tipos para la navegación
export type MainNavigationProp<T extends keyof MainStackParamList> =
  StackNavigationProp<MainStackParamList, T>;

export type AuthNavigationProp<T extends keyof AuthStackParamList> =
  StackNavigationProp<AuthStackParamList, T>;

// Tipos para las rutas
export type MainRouteProp<T extends keyof MainStackParamList> = RouteProp<
  MainStackParamList,
  T
>;

export type AuthRouteProp<T extends keyof AuthStackParamList> = RouteProp<
  AuthStackParamList,
  T
>;
