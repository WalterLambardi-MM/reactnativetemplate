import { createApiClient } from '../../../shared/api/client';
import { PaginatedResponse } from '../../../shared/types/api';
import {
  API_BASE_URL,
  DEFAULT_PAGE_SIZE,
  POKEMON_SPRITE_URL,
} from '../../../shared/constants/api';
import {
  PokemonBasic,
  PokemonDetail,
  mapApiToPokemonBasic,
  mapApiToPokemonDetail,
} from '../types/types';
import { capitalizeFirstLetter } from '../../../shared/utils/arrayUtils';
import { extractPokemonId } from '../../../shared/utils/formatUtils';

// Tipos específicos de la API de Pokémon
interface PokemonListItem {
  name: string;
  url: string;
}

type PokemonListResponse = PaginatedResponse<PokemonListItem>;

const apiClient = createApiClient(API_BASE_URL);

// Adaptador de repositorio simplificado
export const pokemonRepository = {
  getList: async (
    limit = DEFAULT_PAGE_SIZE,
    offset = 0,
  ): Promise<{
    results: PokemonBasic[];
    count: number;
    next: string | null;
  }> => {
    try {
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
      const data = await apiClient.get<PokemonListResponse>(
        `/pokemon/${idOrName}`,
      );
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
        apiClient.get<PokemonListResponse>(p.url.replace(API_BASE_URL, '')),
      );

      const pokemonDetails = await Promise.all(detailPromises);
      return pokemonDetails.map(mapApiToPokemonBasic);
    } catch (error) {
      console.error(`Error searching Pokémon by name "${name}":`, error);
      return [];
    }
  },
};
