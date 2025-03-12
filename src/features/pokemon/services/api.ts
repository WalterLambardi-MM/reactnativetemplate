import { createApiClient } from '../../../shared/api/client';
import {
  PokemonBasic,
  PokemonDetail,
  PokemonListResponse,
  mapApiToPokemonBasic,
  mapApiToPokemonDetail,
} from '../types/types';

// Constantes
//TODO: crear archivo de constantes para las URLs de la API y las imágenes de los Pokémon
const API_BASE_URL = 'https://pokeapi.co/api/v2';
const POKEMON_SPRITE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
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

      const data = await apiClient.get<PokemonListResponse>(
        `/pokemon?limit=${limit}&offset=${offset}`,
      );

      console.log(`Received list with ${data.results.length} Pokémon`);

      // Crear objetos Pokémon directamente desde la lista
      const pokemonList: PokemonBasic[] = data.results.map((pokemon) => {
        const id = extractPokemonId(pokemon.url);
        return {
          id,
          name: capitalizeFirstLetter(pokemon.name),
          imageUrl: `${POKEMON_SPRITE_URL}/${id}.png`,
        };
      });

      return {
        results: pokemonList,
        count: data.count,
        next: data.next,
      };
    } catch (error) {
      console.error('Error in getList:', error);
      return {
        results: [],
        count: 0,
        next: null,
      };
    }
  },

  // Obtener detalles de un Pokémon
  getDetail: async (idOrName: string | number): Promise<PokemonDetail> => {
    try {
      const data = await apiClient.get<any>(`/pokemon/${idOrName}`);
      return mapApiToPokemonDetail(data);
    } catch (error) {
      console.error(`Error fetching details for Pokémon ${idOrName}:`, error);
      throw error;
    }
  },

  // Buscar Pokémon por nombre
  searchByName: async (name: string): Promise<PokemonBasic[]> => {
    try {
      // La PokéAPI no tiene endpoint de búsqueda directa, así que obtenemos varios y filtramos
      const response =
        await apiClient.get<PokemonListResponse>('/pokemon?limit=100');
      const searchTerm = name.toLowerCase();

      const matchingPokemon = response.results.filter((p) =>
        p.name.includes(searchTerm),
      );

      if (matchingPokemon.length === 0) return [];

      const detailPromises = matchingPokemon.map((p) =>
        apiClient.get<any>(p.url.replace(API_BASE_URL, '')),
      );

      const pokemonDetails = await Promise.all(detailPromises);
      return pokemonDetails.map(mapApiToPokemonBasic);
    } catch (error) {
      console.error(`Error searching Pokémon by name "${name}":`, error);
      return [];
    }
  },
};

/**
 * Extrae el ID de un Pokémon de su URL
 */
function extractPokemonId(url: string): number {
  return parseInt(url.split('/').filter(Boolean).pop() || '0');
}

/**
 * Capitaliza la primera letra de un string
 */
function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
