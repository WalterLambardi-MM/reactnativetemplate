import { createApiClient } from '../../../shared/api/client';
import {
  PokemonBasic,
  PokemonDetail,
  mapApiToPokemonBasic,
  mapApiToPokemonDetail,
} from '../types/types';

const API_BASE_URL = 'https://pokeapi.co/api/v2';
const apiClient = createApiClient(API_BASE_URL);

// Adaptador de repositorio simplificado
export const pokemonRepository = {
  getList: async (
    limit = 20,
    offset = 0,
  ): Promise<{
    results: PokemonBasic[];
    count: number;
    next: string | null;
  }> => {
    try {
      // Una sola petición para obtener la lista básica
      console.log(
        `Fetching pokemon list with limit=${limit}, offset=${offset}`,
      );
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
      );

      if (!response.ok) {
        throw new Error(`Error fetching Pokémon list: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Received list with ${data.results.length} Pokémon`);

      // Crear objetos Pokémon directamente desde la lista
      const pokemonList: PokemonBasic[] = data.results.map((pokemon: any) => {
        const id = parseInt(
          pokemon.url.split('/').filter(Boolean).pop() || '0',
        );
        return {
          id,
          name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
          imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
        };
      });

      return {
        results: pokemonList,
        count: data.count,
        next: data.next,
      };
    } catch (error) {
      console.error('Error in getList:', error);
      // En caso de error, devolver datos de fallback
      return {
        results: [
          {
            id: 1,
            name: 'Bulbasaur',
            imageUrl:
              'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
          },
          {
            id: 4,
            name: 'Charmander',
            imageUrl:
              'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
          },
          {
            id: 7,
            name: 'Squirtle',
            imageUrl:
              'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',
          },
        ],
        count: 3,
        next: null,
      };
    }
  },

  // Obtener detalles de un Pokémon
  getDetail: async (idOrName: string | number): Promise<PokemonDetail> => {
    const data = await apiClient.get<any>(`/pokemon/${idOrName}`);
    return mapApiToPokemonDetail(data);
  },

  // Buscar Pokémon por nombre
  searchByName: async (name: string): Promise<PokemonBasic[]> => {
    // La PokéAPI no tiene endpoint de búsqueda directa, así que obtenemos varios y filtramos
    const response = await apiClient.get<any>('/pokemon?limit=100');
    const matchingPokemon = response.results.filter((p: any) =>
      p.name.includes(name.toLowerCase()),
    );

    if (matchingPokemon.length === 0) return [];

    const detailPromises = matchingPokemon.map((p: any) =>
      apiClient.get<any>(p.url.replace(API_BASE_URL, '')),
    );

    const pokemonDetails = await Promise.all(detailPromises);
    return pokemonDetails.map(mapApiToPokemonBasic);
  },
};
