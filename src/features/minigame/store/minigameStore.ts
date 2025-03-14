import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  MinigameState,
  GameScore,
  CurrentGame,
  GameStatus,
  GameConfig,
  GameDifficulty,
} from '../types/minigame.types';
import { minigameService } from '../services/minigameService';
import { calculateScore } from '../utils/gameUtils';

interface MinigameStore extends MinigameState {
  // Acciones
  startGame: (config: GameConfig) => Promise<void>;
  answerQuestion: (
    questionIndex: number,
    optionIndex: number,
    timeSpent: number,
  ) => void;
  nextQuestion: () => void;
  endGame: () => void;
  resetGame: () => void;
  toggleSound: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useMinigameStore = create<MinigameStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      scores: [],
      currentGame: null,
      isLoading: false,
      error: null,
      soundEnabled: true,

      // Acciones
      startGame: async (config: GameConfig) => {
        set({ isLoading: true, error: null });
        try {
          const questions = await minigameService.createGame(config);

          const currentGame: CurrentGame = {
            gameType: config.gameType,
            questions,
            currentQuestionIndex: 0,
            score: 0,
            startTime: Date.now(),
            status: GameStatus.IN_PROGRESS,
            gameConfig: config, // Guardar la configuración del juego
          };

          set({ currentGame, isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : 'Error al iniciar el juego',
            isLoading: false,
          });
        }
      },

      answerQuestion: (
        questionIndex: number,
        optionIndex: number,
        timeSpent: number,
      ) => {
        const { currentGame } = get();
        if (!currentGame) return;

        const updatedQuestions = [...currentGame.questions];
        const question = updatedQuestions[questionIndex];

        // Actualizar la pregunta con la respuesta seleccionada
        updatedQuestions[questionIndex] = {
          ...question,
          answered: true,
          selectedOption: optionIndex, // -1 significa tiempo agotado
          timeSpent,
        };

        // Verificar si la respuesta es correcta
        // Si optionIndex es -1 (tiempo agotado), siempre es incorrecto
        const isCorrect =
          optionIndex >= 0 &&
          question.options[optionIndex]?.id === question.correctPokemon.id;

        // No hay puntos adicionales cuando se agota el tiempo
        let additionalScore = 0;
        if (isCorrect) {
          additionalScore = calculateScore(
            true,
            timeSpent,
            10000, // 10 segundos en milisegundos
            currentGame.gameConfig?.difficulty || GameDifficulty.MEDIUM,
          );
        }

        // Actualizar el juego actual
        set({
          currentGame: {
            ...currentGame,
            questions: updatedQuestions,
            score: currentGame.score + additionalScore,
          },
        });
      },

      nextQuestion: () => {
        const { currentGame } = get();
        if (!currentGame) return;

        const nextIndex = currentGame.currentQuestionIndex + 1;

        // Verificar si hemos llegado al final del juego
        if (nextIndex >= currentGame.questions.length) {
          // Finalizar el juego
          get().endGame();
          return;
        }

        // Avanzar a la siguiente pregunta
        set({
          currentGame: {
            ...currentGame,
            currentQuestionIndex: nextIndex,
          },
        });
      },

      endGame: () => {
        const { currentGame } = get();
        if (!currentGame) return;

        // Asegurarse de que todas las preguntas están respondidas
        const updatedQuestions = currentGame.questions.map((question) => {
          if (!question.answered) {
            // Si hay alguna pregunta sin responder, marcarla como tiempo agotado
            return {
              ...question,
              answered: true,
              selectedOption: -1,
              timeSpent: 0,
            };
          }
          return question;
        });

        const correctAnswers = updatedQuestions.filter((q) => {
          if (q.selectedOption === undefined || q.selectedOption === -1)
            return false;
          return q.options[q.selectedOption].id === q.correctPokemon.id;
        }).length;

        // Marcar el juego como completado
        const completedGame: CurrentGame = {
          ...currentGame,
          questions: updatedQuestions,
          endTime: Date.now(),
          status: GameStatus.COMPLETED,
        };

        // Crear un registro de puntuación
        const newScore: GameScore = {
          id: Date.now().toString(),
          date: Date.now(),
          score: completedGame.score,
          totalQuestions: completedGame.questions.length,
          correctAnswers,
          gameType: completedGame.gameType,
        };

        // Actualizar el estado
        set((state) => ({
          currentGame: completedGame,
          scores: [...state.scores, newScore],
        }));
      },

      resetGame: () => {
        set({ currentGame: null });
      },

      toggleSound: () => {
        set((state) => ({ soundEnabled: !state.soundEnabled }));
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'minigame-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        scores: state.scores,
        soundEnabled: state.soundEnabled,
      }),
    },
  ),
);
