import { useState, useRef, useEffect, useCallback } from 'react';
import { GameQuestion, GameStatus } from '../types/minigame.types';

interface UseGameTimerProps {
  currentQuestion: GameQuestion | null;
  gameStatus: GameStatus | undefined;
  timeLimit: number;
  onTimeUp: () => void;
}

interface UseGameTimerResult {
  timeRemaining: number;
  totalTime: number;
  clearTimer: () => void;
}

export const useGameTimer = ({
  currentQuestion,
  gameStatus,
  timeLimit,
  onTimeUp,
}: UseGameTimerProps): UseGameTimerResult => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (
      currentQuestion &&
      !currentQuestion.answered &&
      gameStatus === GameStatus.IN_PROGRESS
    ) {
      // Establecer el tiempo total y el tiempo restante
      setTotalTime(timeLimit);
      setTimeRemaining(timeLimit);

      // Crear un intervalo que actualice el tiempo restante
      timerIntervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = Math.max(0, prev - 0.1);

          // Si el tiempo llega a cero, responder automáticamente
          if (newTime <= 0 && !currentQuestion.answered) {
            // Limpiar el intervalo
            clearTimer();

            // Notificar que se acabó el tiempo
            onTimeUp();
          }

          return newTime;
        });
      }, 100);

      return () => {
        clearTimer();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion, gameStatus, timeLimit, onTimeUp]);

  // Limpiar el temporizador
  const clearTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  return { timeRemaining, totalTime, clearTimer };
};
