import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  BackHandler,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { PokemonSilhouette } from '../components/PokemonSilhouette';
import { GameOptions } from '../components/GameOptions';
import { GameResult } from '../components/GameResult';
import { useMinigame } from '../hooks/useMinigame';
import { GameStatus, GameType, GameDifficulty } from '../types/minigame.types';
import { MainNavigationProp, MainRouteProp } from '../../../navigation/types';
import { useGameSound } from '../hooks/useGameSound';

export const WhosThatPokemonScreen: React.FC = () => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const navigation = useNavigation<MainNavigationProp<'WhosThatPokemon'>>();
  const route = useRoute<MainRouteProp<'WhosThatPokemon'>>();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { gameType, difficulty, questionCount } = route.params;

  const { startBackgroundMusic, stopBackgroundMusic } = useGameSound();

  // Configuración del juego
  const gameConfig = useMemo(
    () => ({
      gameType: gameType || GameType.WHOS_THAT_POKEMON,
      difficulty: difficulty || GameDifficulty.MEDIUM,
      questionCount: questionCount || 10,
      timeLimit: getTimeLimitForDifficulty(difficulty),
    }),
    [gameType, difficulty, questionCount],
  );

  // Usar el hook del minijuego
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

  // Estado para controlar la revelación de la respuesta
  const [revealed, setRevealed] = useState(false);
  const [timeoutOccurred, setTimeoutOccurred] = useState(false);

  // Efecto para reiniciar estados cuando cambia la pregunta
  useEffect(() => {
    if (currentQuestion) {
      setRevealed(false);
      setTimeoutOccurred(false);
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (
      currentQuestion &&
      !currentQuestion.answered &&
      currentGame?.status === GameStatus.IN_PROGRESS
    ) {
      // Obtener el límite de tiempo
      const timeLimit =
        gameConfig.timeLimit || getTimeLimitForDifficulty(difficulty);

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
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
              timerIntervalRef.current = null;
            }

            // Marcar que ocurrió un timeout
            setTimeoutOccurred(true);

            // Revelar la respuesta
            setRevealed(true);

            // Responder con -1 para indicar tiempo agotado
            answerQuestion(-1);
          }

          return newTime;
        });
      }, 100);

      return () => {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
      };
    }
  }, [currentQuestion, currentGame?.status]);

  // Iniciar el juego al montar el componente
  useEffect(() => {
    startGame(gameConfig);

    startBackgroundMusic();

    // Manejar el botón de retroceso
    const handleBackPress = () => {
      if (currentGame?.status === GameStatus.IN_PROGRESS) {
        Alert.alert(
          'Salir del juego',
          '¿Estás seguro de que quieres salir? Perderás tu progreso actual.',
          [
            { text: 'Cancelar', style: 'cancel', onPress: () => {} },
            {
              text: 'Salir',
              style: 'destructive',
              onPress: () => {
                resetGame();
                navigation.goBack();
              },
            },
          ],
        );
        return true; // Prevenir el comportamiento por defecto
      }
      return false; // Permitir el comportamiento por defecto
    };

    // Añadir listener para el botón de retroceso (Android)
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );

    // Limpiar al desmontar
    return () => {
      backHandler.remove();
      if (timerRef.current) clearTimeout(timerRef.current);
      // Detener música de fondo al salir
      stopBackgroundMusic();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Manejar la selección de una opción
  const handleSelectOption = (optionIndex: number) => {
    // Detener el temporizador
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    // Si es tiempo agotado, marcar el estado
    if (optionIndex === -1) {
      setTimeoutOccurred(true);
    }

    // Siempre revelar la respuesta
    setRevealed(true);

    // Registrar la respuesta
    answerQuestion(optionIndex);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // Pasar a la siguiente pregunta
  const handleNextQuestion = () => {
    setRevealed(false);

    // Verificar si es la última pregunta
    if (
      currentGame &&
      currentGame.currentQuestionIndex >= currentGame.questions.length - 1
    ) {
      // Si es la última pregunta, finalizar el juego
      const gameWithEndTime = {
        ...currentGame,
        endTime: Date.now(),
      };

      // Actualizar el juego con el tiempo de finalización
      // Esto debería desencadenar la visualización de los resultados
      // sin intentar cargar una nueva pregunta
      nextQuestion();
    } else {
      // Si no es la última pregunta, avanzar normalmente
      nextQuestion();
    }
  };

  // Volver a la pantalla de inicio
  const handleGoHome = () => {
    resetGame();
    navigation.goBack();
  };

  // Jugar de nuevo
  const handlePlayAgain = () => {
    resetGame();
    startGame(gameConfig);
  };

  // Renderizar pantalla de carga
  if (isLoading && !currentGame) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#c62828" />
        <Text style={styles.loadingText}>Cargando juego...</Text>
      </View>
    );
  }

  // Renderizar pantalla de error
  if (error && !currentGame) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error" size={48} color="#c62828" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={handleGoHome}>
          <Text style={styles.buttonText}>Volver al Inicio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Renderizar resultado final
  if (currentGame?.status === GameStatus.COMPLETED) {
    return (
      <SafeAreaView style={styles.container}>
        <GameResult
          game={currentGame}
          onPlayAgain={handlePlayAgain}
          onGoHome={handleGoHome}
        />
      </SafeAreaView>
    );
  }

  // Renderizar el juego
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.questionText}>
          Pregunta{' '}
          {currentGame?.currentQuestionIndex !== undefined
            ? currentGame.currentQuestionIndex + 1
            : 0}{' '}
          de {currentGame?.questions.length || 0}
        </Text>
        <Text style={styles.scoreText}>
          Puntuación: {currentGame?.score || 0}
        </Text>
      </View>

      <View style={styles.gameContent}>
        <Text style={styles.title}>¿Quién es ese Pokémon?</Text>

        {/* Temporizador visual */}
        {currentQuestion && !currentQuestion.answered && (
          <View style={styles.timerContainer}>
            <View
              style={[
                styles.timerBar,
                { width: `${(timeRemaining / totalTime) * 100}%` },
                timeRemaining < totalTime * 0.3
                  ? styles.timerCritical
                  : timeRemaining < totalTime * 0.6
                    ? styles.timerWarning
                    : null,
              ]}
            />
          </View>
        )}

        {currentQuestion && (
          <>
            <PokemonSilhouette
              imageUrl={currentQuestion.correctPokemon.imageUrl}
              size={200}
              revealed={revealed}
            />

            <GameOptions
              options={currentQuestion.options}
              selectedOption={currentQuestion.selectedOption}
              correctOption={currentQuestion.options.findIndex(
                (option) => option.id === currentQuestion.correctPokemon.id,
              )}
              onSelect={handleSelectOption}
              disabled={currentQuestion.answered}
            />

            {currentQuestion && currentQuestion.answered && (
              <View style={styles.resultContainer}>
                {timeoutOccurred || currentQuestion.selectedOption === -1 ? (
                  // Mensaje de tiempo agotado
                  <>
                    <Text style={styles.timeoutText}>¡Tiempo agotado!</Text>
                    <Text style={styles.pokemonName}>
                      Es {currentQuestion.correctPokemon.name}
                    </Text>
                  </>
                ) : (
                  // Mensaje normal de correcto/incorrecto
                  <>
                    <Text style={styles.resultText}>
                      {currentQuestion.options[currentQuestion.selectedOption!]
                        .id === currentQuestion.correctPokemon.id
                        ? '¡Correcto!'
                        : '¡Incorrecto!'}
                    </Text>
                    <Text style={styles.pokemonName}>
                      Es {currentQuestion.correctPokemon.name}
                    </Text>
                  </>
                )}

                {currentGame?.currentQuestionIndex ===
                (currentGame?.questions.length ?? 0) - 1 ? (
                  <TouchableOpacity
                    style={styles.nextButton}
                    onPress={() =>
                      currentGame.endTime
                        ? handlePlayAgain()
                        : handleNextQuestion()
                    }
                  >
                    <Text style={styles.nextButtonText}>
                      {currentGame.endTime ? 'Ver Resultados' : 'Siguiente'}
                    </Text>
                    <MaterialIcons
                      name={currentGame.endTime ? 'score' : 'arrow-forward'}
                      size={24}
                      color="white"
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.nextButton}
                    onPress={handleNextQuestion}
                  >
                    <Text style={styles.nextButtonText}>Siguiente</Text>
                    <MaterialIcons
                      name="arrow-forward"
                      size={24}
                      color="white"
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

// Función para determinar el límite de tiempo según la dificultad
const getTimeLimitForDifficulty = (difficulty?: GameDifficulty): number => {
  switch (difficulty) {
    case GameDifficulty.EASY:
      return 15; // 15 segundos
    case GameDifficulty.MEDIUM:
      return 10; // 10 segundos
    case GameDifficulty.HARD:
      return 5; // 5 segundos
    default:
      return 10; // Por defecto, 10 segundos
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 16,
    color: '#c62828',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#c62828',
  },
  gameContent: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  resultContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4caf50',
  },
  pokemonName: {
    fontSize: 20,
    marginBottom: 20,
    color: '#333',
  },
  nextButton: {
    backgroundColor: '#c62828',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  button: {
    backgroundColor: '#c62828',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timerContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginVertical: 15,
    width: '100%',
    overflow: 'hidden',
  },
  timerBar: {
    height: '100%',
    backgroundColor: '#4caf50',
    borderRadius: 4,
  },
  timerWarning: {
    backgroundColor: '#ff9800',
  },
  timerCritical: {
    backgroundColor: '#f44336',
  },
  timeoutText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ff9800',
  },
});
