import { useState, useCallback, useRef } from 'react';
import { useMinigameStore } from '../store/minigameStore';
import { GameConfig } from '../types/minigame.types';
import { useGameSound } from './useGameSound';

export const useMinigame = (config?: GameConfig) => {
  const {
    currentGame,
    isLoading,
    error,
    startGame,
    answerQuestion,
    nextQuestion,
    endGame,
    resetGame,
  } = useMinigameStore();

  const { playCorrect, playIncorrect, playGameOver } = useGameSound();

  // Estado local para el temporizador
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(
    null,
  );

  // Referencia para el intervalo del temporizador
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Iniciar el juego
  const handleStartGame = useCallback(
    async (gameConfig: GameConfig) => {
      await startGame(gameConfig);
      setQuestionStartTime(Date.now());
    },
    [startGame],
  );

  const handleAnswerQuestion = useCallback(
    (optionIndex: number) => {
      if (!currentGame || !questionStartTime) return;

      // Calcular el tiempo que tomó responder
      const timeSpent = Date.now() - questionStartTime;

      // Registrar la respuesta
      answerQuestion(currentGame.currentQuestionIndex, optionIndex, timeSpent);

      // Detener el temporizador
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // Reproducir sonido según la respuesta
      const currentQuestion =
        currentGame.questions[currentGame.currentQuestionIndex];

      // Si optionIndex es -1, significa que se acabó el tiempo
      if (optionIndex === -1) {
        playIncorrect(); // Siempre incorrecto cuando se acaba el tiempo
      } else {
        const isCorrect =
          currentQuestion.options[optionIndex].id ===
          currentQuestion.correctPokemon.id;

        if (isCorrect) {
          playCorrect();
        } else {
          playIncorrect();
        }
      }
    },
    [
      currentGame,
      questionStartTime,
      answerQuestion,
      playCorrect,
      playIncorrect,
    ],
  );

  // Avanzar a la siguiente pregunta
  const handleNextQuestion = useCallback(() => {
    nextQuestion();
    setQuestionStartTime(Date.now());
  }, [nextQuestion]);

  // Finalizar el juego
  const handleEndGame = useCallback(() => {
    endGame();
    playGameOver();

    // Detener el temporizador
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [endGame, playGameOver]);

  // Reiniciar el juego
  const handleResetGame = useCallback(() => {
    resetGame();

    // Detener el temporizador
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [resetGame]);

  // Obtener la pregunta actual
  const currentQuestion = currentGame
    ? currentGame.questions[currentGame.currentQuestionIndex]
    : null;

  // Calcular progreso del juego
  const progress = currentGame
    ? (currentGame.currentQuestionIndex + 1) / currentGame.questions.length
    : 0;

  return {
    // Estado
    currentGame,
    currentQuestion,
    isLoading,
    error,
    progress,

    // Acciones
    startGame: handleStartGame,
    answerQuestion: handleAnswerQuestion,
    nextQuestion: handleNextQuestion,
    endGame: handleEndGame,
    resetGame: handleResetGame,
  };
};
