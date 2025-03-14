import { useEffect, useState, useCallback } from 'react';
import { Audio } from 'expo-av';
import { useMinigameStore } from '../store/minigameStore';
import { GameStatus } from '../types/minigame.types';

export const useGameSound = () => {
  const { soundEnabled, currentGame } = useMinigameStore();
  const [sounds, setSounds] = useState<Record<string, Audio.Sound | null>>({
    correct: null,
    incorrect: null,
    gameOver: null,
    background: null,
  });

  // Flag para rastrear si la música de fondo está reproduciendo
  const [isBackgroundPlaying, setIsBackgroundPlaying] = useState(false);

  // Cargar sonidos
  useEffect(() => {
    const loadSounds = async () => {
      try {
        // Cargar sonidos
        const correctSound = new Audio.Sound();
        await correctSound.loadAsync(
          require('../../../../assets/sounds/correct.mp3'),
        );

        const incorrectSound = new Audio.Sound();
        await incorrectSound.loadAsync(
          require('../../../../assets/sounds/incorrect.mp3'),
        );

        const gameOverSound = new Audio.Sound();
        await gameOverSound.loadAsync(
          require('../../../../assets/sounds/game-over.mp3'),
        );

        const backgroundSound = new Audio.Sound();
        await backgroundSound.loadAsync(
          require('../../../../assets/sounds/background.mp3'),
        );

        // Configurar el sonido de fondo para que se repita
        await backgroundSound.setIsLoopingAsync(true);
        // Bajar el volumen del sonido de fondo
        await backgroundSound.setVolumeAsync(0.3);

        setSounds({
          correct: correctSound,
          incorrect: incorrectSound,
          gameOver: gameOverSound,
          background: backgroundSound,
        });
      } catch (error) {
        console.error('Error al cargar los sonidos:', error);
      }
    };

    loadSounds();

    // Limpiar sonidos al desmontar
    return () => {
      Object.values(sounds).forEach(async (sound) => {
        if (sound) {
          try {
            await sound.stopAsync();
            await sound.unloadAsync();
          } catch (error) {
            console.error('Error al limpiar sonidos:', error);
          }
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reproducir sonido de respuesta correcta
  const playCorrect = useCallback(async () => {
    if (soundEnabled && sounds.correct) {
      try {
        await sounds.correct.replayAsync();
      } catch (error) {
        console.error('Error al reproducir sonido correcto:', error);
      }
    }
  }, [soundEnabled, sounds.correct]);

  // Reproducir sonido de respuesta incorrecta
  const playIncorrect = useCallback(async () => {
    if (soundEnabled && sounds.incorrect) {
      try {
        await sounds.incorrect.replayAsync();
      } catch (error) {
        console.error('Error al reproducir sonido incorrecto:', error);
      }
    }
  }, [soundEnabled, sounds.incorrect]);

  // Reproducir sonido de fin de juego
  const playGameOver = useCallback(async () => {
    if (soundEnabled && sounds.gameOver) {
      try {
        await sounds.gameOver.replayAsync();
      } catch (error) {
        console.error('Error al reproducir sonido de fin de juego:', error);
      }
    }
  }, [soundEnabled, sounds.gameOver]);

  // Iniciar música de fondo
  const startBackgroundMusic = useCallback(async () => {
    if (soundEnabled && sounds.background) {
      try {
        // Verificar el estado actual para evitar reinicios innecesarios
        const status = await sounds.background.getStatusAsync();

        // Solo iniciar si no está reproduciendo
        if (!status.isLoaded || !status.isPlaying) {
          await sounds.background.setPositionAsync(0); // Reiniciar desde el principio
          await sounds.background.playAsync();
          setIsBackgroundPlaying(true);
        }
      } catch (error) {
        console.error('Error al reproducir música de fondo:', error);
      }
    }
  }, [soundEnabled, sounds.background]);

  // Detener música de fondo
  const stopBackgroundMusic = useCallback(async () => {
    if (sounds.background) {
      try {
        const status = await sounds.background.getStatusAsync();
        if (status.isLoaded && status.isPlaying) {
          await sounds.background.stopAsync();
          setIsBackgroundPlaying(false);
        }
      } catch (error) {
        console.error('Error al detener música de fondo:', error);
      }
    }
  }, [sounds.background]);

  // Pausar música de fondo
  const pauseBackgroundMusic = useCallback(async () => {
    if (sounds.background) {
      try {
        const status = await sounds.background.getStatusAsync();
        if (status.isLoaded && status.isPlaying) {
          await sounds.background.pauseAsync();
          setIsBackgroundPlaying(false);
        }
      } catch (error) {
        console.error('Error al pausar música de fondo:', error);
      }
    }
  }, [sounds.background]);

  // Gestionar música de fondo según el estado del juego
  useEffect(() => {
    if (!sounds.background) return;

    // Iniciar música cuando el juego está en progreso
    if (currentGame?.status === GameStatus.IN_PROGRESS && soundEnabled) {
      startBackgroundMusic();
    }
    // Detener música cuando el juego termina o no hay juego activo
    else if (
      currentGame?.status === GameStatus.COMPLETED ||
      currentGame?.status === GameStatus.FAILED ||
      !currentGame
    ) {
      stopBackgroundMusic();
    }
  }, [
    currentGame?.status,
    soundEnabled,
    startBackgroundMusic,
    stopBackgroundMusic,
    sounds.background,
    currentGame,
  ]);

  // Pausar/reanudar música de fondo según el estado de soundEnabled
  useEffect(() => {
    if (!sounds.background) return;

    if (soundEnabled) {
      // Solo reanudar si el juego está en progreso
      if (currentGame?.status === GameStatus.IN_PROGRESS) {
        startBackgroundMusic();
      }
    } else {
      pauseBackgroundMusic();
    }
  }, [
    soundEnabled,
    currentGame?.status,
    startBackgroundMusic,
    pauseBackgroundMusic,
    sounds.background,
  ]);

  return {
    playCorrect,
    playIncorrect,
    playGameOver,
    startBackgroundMusic,
    stopBackgroundMusic,
    pauseBackgroundMusic,
    isBackgroundPlaying,
  };
};
