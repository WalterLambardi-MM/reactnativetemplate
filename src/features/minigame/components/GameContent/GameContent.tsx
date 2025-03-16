import React from 'react';
import { View, Text } from 'react-native';
import { PokemonSilhouette } from '../PokemonSilhouette/PokemonSilhouette';
import { GameOptions } from '../GameOptions/GameOptions';
import { TimerBar } from '../TimerBar/TimerBar';
import { AnswerResult } from '../AnswerResult/AnswerResult';
import { GameQuestion } from '../../types/minigame.types';
import styles from './styles';

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
