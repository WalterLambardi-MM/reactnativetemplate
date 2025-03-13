import { GameDifficulty } from '../types/minigame.types';

/**
 * Baraja un array utilizando el algoritmo de Fisher-Yates
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

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
 * Formatea el tiempo en milisegundos a un formato legible
 */
export const formatTime = (timeMs: number): string => {
  const totalSeconds = Math.ceil(timeMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
