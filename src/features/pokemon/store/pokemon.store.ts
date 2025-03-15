import { create } from 'zustand';
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PokemonBasic, PokemonDetail } from '../types/pokemon.types';
import { withReactotronMiddleware } from '../../../shared/store/middleware/reactotronMiddleware';
import { StateCreator } from 'zustand';

interface PokemonState {
  // Estado
  pokemonList: PokemonBasic[];
  selectedPokemon: PokemonDetail | null;
  favorites: number[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;

  // Acciones
  setPokemonList: (pokemon: PokemonBasic[], total: number) => void;
  setSelectedPokemon: (pokemon: PokemonDetail | null) => void;
  toggleFavorite: (pokemonId: number) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// Definir el creador de estado base con tipo correcto
const createBasePokemonStore: StateCreator<PokemonState, [], []> = (set) => ({
  // Estado inicial
  pokemonList: [],
  selectedPokemon: null,
  favorites: [],
  isLoading: false,
  error: null,
  totalCount: 0,

  // Acciones
  setPokemonList: (pokemon: PokemonBasic[], total: number) =>
    set({
      pokemonList: pokemon,
      totalCount: total,
    }),

  setSelectedPokemon: (pokemon: PokemonDetail | null) =>
    set({
      selectedPokemon: pokemon,
    }),

  toggleFavorite: (pokemonId: number) =>
    set((state) => {
      const isFavorite = state.favorites.includes(pokemonId);
      const newFavorites = isFavorite
        ? state.favorites.filter((id) => id !== pokemonId)
        : [...state.favorites, pokemonId];

      return { favorites: newFavorites };
    }),

  setLoading: (isLoading: boolean) => set({ isLoading }),

  setError: (error: string | null) => set({ error }),

  clearError: () => set({ error: null }),
});

// Opciones de persistencia
const persistOptions: PersistOptions<
  PokemonState,
  Pick<PokemonState, 'favorites'>
> = {
  name: 'pokemon-storage',
  storage: createJSONStorage(() => AsyncStorage),
  partialize: (state) => ({
    favorites: state.favorites,
  }),
  version: 1,
  onRehydrateStorage: () => {
    return (state, error) => {
      if (error) {
        console.error('Error al hidratar el estado:', error);
      } else {
        console.log('Estado hidratado correctamente');

        // Registrar en Reactotron cuando se completa la hidratación
        if (__DEV__ && state) {
          import('../../../../ReactotronConfig')
            .then(({ default: reactotron }) => {
              reactotron.display({
                name: 'ZUSTAND [PokemonStore] - REHYDRATED',
                preview: 'Estado restaurado del almacenamiento',
                value: state,
              });
            })
            .catch(console.error);
        }
      }
    };
  },
  migrate: (persistedState: any, version) => {
    if (version === 0) {
      return {
        ...persistedState,
      };
    }
    return persistedState as Partial<PokemonState>;
  },
};

// Crear el store con middleware
export const usePokemonStore = create<PokemonState>()(
  persist(
    // Aplicar el middleware de Reactotron estandarizado
    withReactotronMiddleware<PokemonState>(
      'PokemonStore',
      createBasePokemonStore,
    ),
    persistOptions,
  ),
);

// El resto de tu código (selectores y acciones) permanece igual
export const usePokemonList = () =>
  usePokemonStore((state) => ({
    pokemonList: state.pokemonList,
    isLoading: state.isLoading,
    error: state.error,
    totalCount: state.totalCount,
  }));

export const usePokemonDetail = () =>
  usePokemonStore((state) => ({
    selectedPokemon: state.selectedPokemon,
    isLoading: state.isLoading,
    error: state.error,
  }));

export const usePokemonFavorites = () =>
  usePokemonStore((state) => ({
    favorites: state.favorites,
    toggleFavorite: state.toggleFavorite,
  }));

export const pokemonActions = {
  loadAndFavorite: async (id: number) => {
    const { setLoading, setError, toggleFavorite } = usePokemonStore.getState();

    setLoading(true);
    try {
      toggleFavorite(id);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  },

  resetStore: () => {
    usePokemonStore.setState({
      pokemonList: [],
      selectedPokemon: null,
      isLoading: false,
      error: null,
      totalCount: 0,
    });
  },
};
