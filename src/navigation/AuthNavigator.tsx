import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthStackParamList } from './types';
import {
  LoginScreen,
  PasswordResetScreen,
  RegisterScreen,
} from '../features/authentication';

const AuthStack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#c62828',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: 'Crear Cuenta' }}
      />
      <AuthStack.Screen
        name="PasswordReset"
        component={PasswordResetScreen}
        options={{ title: 'Recuperar Contraseña' }}
      />
    </AuthStack.Navigator>
  );
};
