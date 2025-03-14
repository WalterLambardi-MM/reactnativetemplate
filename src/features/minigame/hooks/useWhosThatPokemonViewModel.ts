import { useCallback, useMemo } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useWhosThatPokemon } from './useWhosThatPokemon';
import { useGameBackHandler } from './useGameBackHandler';
import { GameStatus } from '../types/minigame.types';
import { getTimeLimitForDifficulty } from '../utils/gameUtils';
import {
  MainNavigationProp,
  MainRouteProp,
} from '../../../shared/types/navigation.types';

export const useWhosThatPokemonViewModel = () => {
  const navigation = useNavigation<MainNavigationProp<'WhosThatPokemon'>>();
  const route = useRoute<MainRouteProp<'WhosThatPokemon'>>();
  const { gameType, difficulty, questionCount } = route.params;

  // Configuración del juego
  const gameConfig = useMemo(
    () => ({
      gameType: gameType,
      difficulty: difficulty,
      questionCount: questionCount || 10,
      timeLimit: getTimeLimitForDifficulty(difficulty),
    }),
    [gameType, difficulty, questionCount],
  );

  // Usar el hook personalizado para toda la lógica del juego
  const {
    currentGame,
    currentQuestion,
    isLoading,
    error,
    revealed,
    timeoutOccurred,
    timeRemaining,
    totalTime,
    isLastQuestion,
    handleSelectOption,
    handleNextQuestion,
    resetGame,
    restartGame,
  } = useWhosThatPokemon(gameConfig);

  // Volver a la pantalla de inicio
  const handleGoHome = useCallback(() => {
    resetGame();
    navigation.goBack();
  }, [resetGame, navigation]);

  // Jugar de nuevo
  const handlePlayAgain = useCallback(() => {
    restartGame();
  }, [restartGame]);

  // Manejar el botón de retroceso
  useGameBackHandler({
    isGameInProgress: currentGame?.status === GameStatus.IN_PROGRESS,
    onExit: handleGoHome,
  });

  return {
    currentGame,
    currentQuestion,
    isLoading,
    error,
    revealed,
    timeoutOccurred,
    timeRemaining,
    totalTime,
    isLastQuestion,
    handleSelectOption,
    handleNextQuestion,
    handleGoHome,
    handlePlayAgain,
  };
};
