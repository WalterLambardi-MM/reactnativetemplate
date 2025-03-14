import { GameDifficulty } from '../types/minigame.types';

/**
 * Calcula la puntuación para una pregunta basada en el tiempo y la dificultad
 */
export const calculateScore = (
  isCorrect: boolean,
  timeSpentMs: number,
  timeLimitMs: number,
  difficulty: GameDifficulty,
): number => {
  if (!isCorrect) return 0;

  // Puntuación base según dificultad
  let baseScore = 0;
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
  const timeRatio = Math.max(0, 1 - timeSpentMs / timeLimitMs);
  const timeBonus = Math.floor(baseScore * 0.5 * timeRatio);

  return baseScore + timeBonus;
};

/**
 * Obtiene el límite de tiempo en segundos según la dificultad
 */
export const getTimeLimitForDifficulty = (
  difficulty: GameDifficulty,
): number => {
  switch (difficulty) {
    case GameDifficulty.EASY:
      return 15; // 15 segundos
    case GameDifficulty.MEDIUM:
      return 10; // 10 segundos
    case GameDifficulty.HARD:
      return 5; // 5 segundos
  }
};

/**
 * Genera un mensaje según la puntuación y precisión
 */
export const getResultMessage = (
  score: number,
  totalQuestions: number,
  correctAnswers: number,
): string => {
  const accuracy = (correctAnswers / totalQuestions) * 100;

  if (accuracy >= 90) {
    return '¡Increíble! ¡Eres un Maestro Pokémon!';
  } else if (accuracy >= 70) {
    return '¡Muy bien! Estás en camino a ser un gran entrenador.';
  } else if (accuracy >= 50) {
    return 'Buen intento. Sigue practicando para mejorar.';
  } else {
    return 'Necesitas estudiar más sobre Pokémon. ¡No te rindas!';
  }
};
