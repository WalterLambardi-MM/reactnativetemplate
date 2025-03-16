import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { useWhosThatPokemonViewModel } from '../hooks/useWhosThatPokemonViewModel';
import { GameResult } from '../components/GameResult/GameResult';
import { GameHeader } from '../components/GameHeader/GameHeader';
import { LoadingGame } from '../components/LoadingGame/LoadingGame';
import { ErrorScreen } from '../components/ErrorScreen/ErrorScreen';
import { GameContent } from '../components/GameContent/GameContent';

export const WhosThatPokemonScreen: React.FC = () => {
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
    handleGoHome,
    handlePlayAgain,
  } = useWhosThatPokemonViewModel();

  // Renderizar pantalla de carga
  if (isLoading && !currentGame) {
    return <LoadingGame />;
  }

  // Renderizar pantalla de error
  if (error && !currentGame) {
    return <ErrorScreen error={error} onGoHome={handleGoHome} />;
  }

  // Renderizar resultado final
  if (currentGame?.status === 'COMPLETED') {
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
