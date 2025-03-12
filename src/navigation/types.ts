import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

// Tipos para el stack de autenticación
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  PasswordReset: undefined;
};

// Tipos para el stack principal
export type MainStackParamList = {
  PokemonList: undefined;
  PokemonDetail: { id: number };
  Profile: undefined;
};

// Tipos para el stack raíz
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

// Tipos para la navegación
export type AuthNavigationProp<T extends keyof AuthStackParamList> =
  StackNavigationProp<AuthStackParamList, T>;

export type MainNavigationProp<T extends keyof MainStackParamList> =
  StackNavigationProp<MainStackParamList, T>;

// Tipos para las rutas
export type AuthRouteProp<T extends keyof AuthStackParamList> = RouteProp<
  AuthStackParamList,
  T
>;

export type MainRouteProp<T extends keyof MainStackParamList> = RouteProp<
  MainStackParamList,
  T
>;
