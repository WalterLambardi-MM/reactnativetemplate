import { PokemonBasic } from '../../pokemon/types/types';

export interface MinigameState {
  scores: GameScore[];
  currentGame: CurrentGame | null;
  isLoading: boolean;
  error: string | null;
  soundEnabled: boolean;
}

export interface GameScore {
  id: string;
  date: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  gameType: GameType;
}

export interface CurrentGame {
  gameType: GameType;
  questions: GameQuestion[];
  currentQuestionIndex: number;
  score: number;
  startTime: number;
  endTime?: number;
  status: GameStatus;
  gameConfig?: GameConfig;
}

export interface GameQuestion {
  id: number;
  correctPokemon: PokemonBasic;
  options: PokemonBasic[];
  answered: boolean;
  selectedOption?: number;
  timeSpent?: number;
}

export enum GameType {
  WHOS_THAT_POKEMON = 'WHOS_THAT_POKEMON',
  POKEMON_TYPES = 'POKEMON_TYPES',
  POKEMON_ABILITIES = 'POKEMON_ABILITIES',
}

export enum GameStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum GameDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export interface GameConfig {
  gameType: GameType;
  questionCount: number;
  difficulty: GameDifficulty;
  timeLimit?: number; // Tiempo en segundos por pregunta, si aplica
}
