import { create } from 'zustand';
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';
import {
  AuthState,
  LoginCredentials,
  RegisterCredentials,
} from '../types/auth.types';
import { createReactotronLogger } from '../../../../ReactotronConfig';
import { StateCreator } from 'zustand';

// Variable para almacenar la función de limpieza fuera del estado
let authUnsubscribe: (() => void) | null = null;

interface AuthStore extends AuthState {
  // Acciones
  initialize: () => Promise<void>;
  cleanup: () => void;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: {
    displayName?: string;
    photoURL?: string;
  }) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  sendEmailVerification: () => Promise<void>;
  clearError: () => void;
}

// Configuración de persistencia
type AuthPersistOptions = PersistOptions<
  AuthStore,
  Pick<AuthStore, 'user' | 'isAuthenticated'>
>;

const persistOptions: AuthPersistOptions = {
  name: 'auth-storage',
  storage: createJSONStorage(() => AsyncStorage),
  partialize: (state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
  }),
  // Añadir monitoreo de rehidratación
  onRehydrateStorage: () => {
    return (state, error) => {
      if (error) {
        console.error('Error al hidratar el estado de autenticación:', error);
      } else {
        console.log('Estado de autenticación hidratado correctamente');

        // Registrar en Reactotron cuando se completa la hidratación
        if (__DEV__ && state) {
          import('../../../../ReactotronConfig')
            .then(({ default: reactotron }) => {
              reactotron.display({
                name: 'ZUSTAND [AuthStore] - REHYDRATED',
                preview: 'Estado de autenticación restaurado',
                value: state,
              });
            })
            .catch(console.error);
        }
      }
    };
  },
};

// Definir el store base con tipo correcto
const createBaseAuthStore: StateCreator<AuthStore, [], []> = (set, get) => ({
  // Estado inicial
  user: null,
  isLoading: true,
  error: null,
  isAuthenticated: false,

  // Inicializar el estado de autenticación
  initialize: async () => {
    set({ isLoading: true });
    try {
      // Limpiar cualquier suscripción existente
      if (authUnsubscribe) {
        authUnsubscribe();
        authUnsubscribe = null;
      }

      // Crear nueva suscripción
      authUnsubscribe = authService.onAuthStateChanged((user) => {
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
          error: null,
        });
      });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  },

  // Método para limpiar la suscripción
  cleanup: () => {
    if (authUnsubscribe) {
      authUnsubscribe();
      authUnsubscribe = null;
    }
  },

  // Iniciar sesión
  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.login(credentials);
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },
  // Registrar usuario
  register: async (credentials: RegisterCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.register(credentials);
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  // Cerrar sesión
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await authService.logout();

      // Limpiar la suscripción al cerrar sesión
      if (authUnsubscribe) {
        authUnsubscribe();
        authUnsubscribe = null;
      }

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
      throw error;
    }
  },

  // Restablecer contraseña
  resetPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      await authService.resetPassword(email);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
      throw error;
    }
  },

  // Actualizar perfil
  updateProfile: async (data: { displayName?: string; photoURL?: string }) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await authService.updateProfile(data);
      set({
        user: updatedUser,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
      throw error;
    }
  },

  // Actualizar contraseña
  updatePassword: async (newPassword: string) => {
    set({ isLoading: true, error: null });
    try {
      await authService.updatePassword(newPassword);
      set({ isLoading: false, error: null });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
      throw error;
    }
  },

  // Enviar verificación de email
  sendEmailVerification: async () => {
    set({ isLoading: true, error: null });
    try {
      await authService.sendEmailVerification();
      set({ isLoading: false, error: null });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
      throw error;
    }
  },

  // Limpiar errores
  clearError: () => set({ error: null }),
});

// Crear el store con middleware
export const useAuthStore = create<AuthStore>()(
  persist(
    // Aplicar el middleware de Reactotron en desarrollo
    __DEV__
      ? createReactotronLogger<AuthStore>('AuthStore')(createBaseAuthStore)
      : createBaseAuthStore,
    persistOptions,
  ),
);

// Selectores
export const useAuthUser = () =>
  useAuthStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
  }));

export const useAuthStatus = () =>
  useAuthStore((state) => ({
    isLoading: state.isLoading,
    error: state.error,
    clearError: state.clearError,
  }));
