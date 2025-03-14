import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PokemonSilhouette } from './PokemonSilhouette';
import { GameOptions } from './GameOptions';
import { TimerBar } from './TimerBar';
import { AnswerResult } from './AnswerResult';
import { GameQuestion } from '../types/minigame.types';

interface GameContentProps {
  currentQuestion: GameQuestion;
  timeRemaining: number;
  totalTime: number;
  revealed: boolean;
  timeoutOccurred: boolean;
  isLastQuestion: boolean;
  onSelectOption: (index: number) => void;
  onNextQuestion: () => void;
}

export const GameContent: React.FC<GameContentProps> = ({
  currentQuestion,
  timeRemaining,
  totalTime,
  revealed,
  timeoutOccurred,
  isLastQuestion,
  onSelectOption,
  onNextQuestion,
}) => {
  return (
    <View style={styles.gameContent}>
      <Text style={styles.title}>¿Quién es ese Pokémon?</Text>

      {/* Temporizador visual */}
      {!currentQuestion.answered && (
        <TimerBar timeRemaining={timeRemaining} totalTime={totalTime} />
      )}

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
        onSelect={onSelectOption}
        disabled={currentQuestion.answered}
      />

      {currentQuestion.answered && (
        <AnswerResult
          currentQuestion={currentQuestion}
          timeoutOccurred={timeoutOccurred}
          isLastQuestion={isLastQuestion}
          onNextQuestion={onNextQuestion}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
});
