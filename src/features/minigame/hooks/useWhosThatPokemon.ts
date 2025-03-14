import { useState, useCallback, useEffect, useMemo } from 'react';
import { useMinigame } from './useMinigame';
import { useGameSound } from './useGameSound';
import { useGameTimer } from './useGameTimer';
import { GameConfig } from '../types/minigame.types';

export const useWhosThatPokemon = (gameConfig: GameConfig) => {
  // Estados locales
  const [revealed, setRevealed] = useState<boolean>(false);
  const [timeoutOccurred, setTimeoutOccurred] = useState<boolean>(false);

  // Hooks
  const { startBackgroundMusic, stopBackgroundMusic } = useGameSound();
  const {
    currentGame,
    currentQuestion,
    isLoading,
    error,
    startGame,
    answerQuestion,
    nextQuestion,
    resetGame,
  } = useMinigame(gameConfig);

  // Manejar la selección de una opción
  const handleSelectOption = useCallback(
    (optionIndex: number) => {
      // Si es tiempo agotado, marcar el estado
      if (optionIndex === -1) {
        setTimeoutOccurred(true);
      }

      // Siempre revelar la respuesta
      setRevealed(true);

      // Registrar la respuesta
      answerQuestion(optionIndex);
    },
    [answerQuestion],
  );

  // Callback para cuando se acaba el tiempo
  const handleTimeUp = useCallback(() => {
    setTimeoutOccurred(true);
    setRevealed(true);
    handleSelectOption(-1);
  }, [handleSelectOption]);

  // Hook para manejar el temporizador
  const { timeRemaining, totalTime, clearTimer } = useGameTimer({
    currentQuestion,
    gameStatus: currentGame?.status,
    timeLimit: gameConfig.timeLimit || 10,
    onTimeUp: handleTimeUp,
  });

  // Pasar a la siguiente pregunta
  const handleNextQuestion = useCallback(() => {
    setRevealed(false);
    setTimeoutOccurred(false);

    // Verificar si es la última pregunta
    if (
      currentGame &&
      currentGame.currentQuestionIndex >= currentGame.questions.length - 1
    ) {
      // Si es la última pregunta, finalizar el juego
      nextQuestion();
    } else {
      // Si no es la última pregunta, avanzar normalmente
      nextQuestion();
    }
  }, [currentGame, nextQuestion]);

  // Iniciar el juego
  const startPokemonGame = useCallback(() => {
    startGame(gameConfig);
    startBackgroundMusic();
  }, [startGame, startBackgroundMusic, gameConfig]);

  // Reiniciar el juego
  const restartGame = useCallback(() => {
    resetGame();
    // Pequeño delay para asegurar que el estado se ha limpiado
    setTimeout(() => {
      startGame(gameConfig);
    }, 100);
  }, [resetGame, startGame, gameConfig]);

  // Verificar si es la última pregunta
  const isLastQuestion = useMemo(() => {
    if (!currentGame) return false;
    return (
      currentGame.currentQuestionIndex === currentGame.questions.length - 1
    );
  }, [currentGame]);

  // Iniciar el juego al montar el componente
  useEffect(() => {
    startPokemonGame();

    // Limpiar al desmontar
    return () => {
      clearTimer();
      stopBackgroundMusic();
    };
  }, []);

  return {
    // Estado del juego
    currentGame,
    currentQuestion,
    isLoading,
    error,
    revealed,
    timeoutOccurred,
    timeRemaining,
    totalTime,
    isLastQuestion,

    // Acciones
    handleSelectOption,
    handleNextQuestion,
    resetGame,
    restartGame,
  };
};
