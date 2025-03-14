import { shuffleArray } from '../../../shared/utils/arrayUtils';
import { pokemonService } from '../../pokemon/services/pokemonApi';
import { PokemonBasic } from '../../pokemon/types/pokemon.types';
import {
  GameConfig,
  GameQuestion,
  GameType,
  GameDifficulty,
} from '../types/minigame.types';

// Función auxiliar: Generar opciones para una pregunta
const generateOptions = (
  correctPokemon: PokemonBasic,
  allPokemon: PokemonBasic[],
  count: number,
): PokemonBasic[] => {
  // Filtrar el Pokémon correcto de la lista completa
  const otherPokemon = allPokemon.filter((p) => p.id !== correctPokemon.id);

  // Barajar los Pokémon restantes
  const shuffledOthers = shuffleArray(otherPokemon);

  // Tomar count-1 Pokémon incorrectos
  const incorrectOptions = shuffledOthers.slice(0, count - 1);

  // Combinar con el Pokémon correcto
  const allOptions = [...incorrectOptions, correctPokemon];

  // Barajar las opciones para que la correcta no esté siempre en la misma posición
  return shuffleArray(allOptions);
};

// Función: Crear juego específico "¿Quién es ese Pokémon?"
const createWhosThatPokemonGame = (
  pokemonList: PokemonBasic[],
  config: GameConfig,
): GameQuestion[] => {
  // Barajar la lista de Pokémon
  const shuffledPokemon = shuffleArray([...pokemonList]);

  // Determinar número de opciones según dificultad
  let optionsCount = 4;
  switch (config.difficulty) {
    case GameDifficulty.EASY:
      optionsCount = 3;
      break;
    case GameDifficulty.MEDIUM:
      optionsCount = 4;
      break;
    case GameDifficulty.HARD:
      optionsCount = 6;
      break;
  }

  // Crear las preguntas
  const questions: GameQuestion[] = [];

  for (let i = 0; i < config.questionCount; i++) {
    // Asegurarse de que tenemos suficientes Pokémon
    if (i >= shuffledPokemon.length) break;

    // Seleccionar el Pokémon correcto para esta pregunta
    const correctPokemon = shuffledPokemon[i];

    // Crear opciones (incluyendo la correcta)
    const options = generateOptions(
      correctPokemon,
      shuffledPokemon,
      optionsCount,
    );

    // Crear la pregunta
    questions.push({
      id: i + 1,
      correctPokemon,
      options,
      answered: false,
    });
  }

  return questions;
};

// Función principal: Crear un nuevo juego basado en la configuración
export const createGame = async (
  config: GameConfig,
): Promise<GameQuestion[]> => {
  try {
    // Obtener una lista de Pokémon para el juego
    const { results: pokemonList } = await pokemonService.getList(100, 0);

    // Crear preguntas según el tipo de juego
    switch (config.gameType) {
      case GameType.WHOS_THAT_POKEMON:
        return createWhosThatPokemonGame(pokemonList, config);
      default:
        throw new Error(`Tipo de juego no implementado: ${config.gameType}`);
    }
  } catch (error) {
    console.error('Error al crear el juego:', error);
    throw error;
  }
};

// Calcular puntuación para una pregunta
export const calculateQuestionScore = (
  timeSpent: number,
  maxTime: number,
  difficulty: GameDifficulty,
): number => {
  // Base score
  let baseScore = 100;

  // Ajustar según dificultad
  switch (difficulty) {
    case GameDifficulty.EASY:
      baseScore = 50;
      break;
    case GameDifficulty.MEDIUM:
      baseScore = 100;
      break;
    case GameDifficulty.HARD:
      baseScore = 150;
      break;
  }

  // Bonus por tiempo (más rápido = más puntos)
  const timeRatio = 1 - Math.min(timeSpent / maxTime, 1);
  const timeBonus = Math.floor(baseScore * 0.5 * timeRatio);

  return baseScore + timeBonus;
};

// Exportar un objeto para mantener compatibilidad con código existente
export const minigameService = {
  createGame,
  calculateQuestionScore,
};
