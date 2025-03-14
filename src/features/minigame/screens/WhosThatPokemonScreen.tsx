import React, { useCallback, useMemo } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GameResult } from '../components/GameResult';
import { GameHeader } from '../components/GameHeader';
import { LoadingGame } from '../components/LoadingGame';
import { ErrorScreen } from '../components/ErrorScreen';
import { GameContent } from '../components/GameContent';
import { useWhosThatPokemon } from '../hooks/useWhosThatPokemon';
import { useGameBackHandler } from '../hooks/useGameBackHandler';
import { GameStatus, GameType, GameDifficulty } from '../types/minigame.types';
import { MainNavigationProp, MainRouteProp } from '../../../navigation/types';
import { getTimeLimitForDifficulty } from '../utils/gameUtils';

export const WhosThatPokemonScreen: React.FC = () => {
  const navigation = useNavigation<MainNavigationProp<'WhosThatPokemon'>>();
  const route = useRoute<MainRouteProp<'WhosThatPokemon'>>();
  const { gameType, difficulty, questionCount } = route.params;

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

  // Renderizar pantalla de carga
  if (isLoading && !currentGame) {
    return <LoadingGame />;
  }

  // Renderizar pantalla de error
  if (error && !currentGame) {
    return <ErrorScreen error={error} onGoHome={handleGoHome} />;
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
      {currentGame && (
        <GameHeader
          currentIndex={currentGame.currentQuestionIndex}
          totalQuestions={currentGame.questions.length}
          score={currentGame.score}
        />
      )}

      {currentQuestion && (
        <GameContent
          currentQuestion={currentQuestion}
          timeRemaining={timeRemaining}
          totalTime={totalTime}
          revealed={revealed}
          timeoutOccurred={timeoutOccurred}
          isLastQuestion={isLastQuestion}
          onSelectOption={handleSelectOption}
          onNextQuestion={handleNextQuestion}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
