import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { ScoreBoard } from '../components/ScoreBoard';
import { useMinigameStore } from '../store/minigameStore';
import { GameType, GameDifficulty } from '../types/minigame.types';

export const MinigameHomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { scores, soundEnabled, toggleSound } = useMinigameStore();

  // Estado para la configuración del juego
  const [selectedGameType, setSelectedGameType] = useState(
    GameType.WHOS_THAT_POKEMON,
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState(
    GameDifficulty.MEDIUM,
  );
  const [questionCount, setQuestionCount] = useState(10);

  // Iniciar el juego
  const handleStartGame = () => {
    navigation.navigate('WhosThatPokemon', {
      gameType: selectedGameType,
      difficulty: selectedDifficulty,
      questionCount,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../../../assets/minigame-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.subtitle}>
          ¡Pon a prueba tus conocimientos Pokémon!
        </Text>
      </View>

      <View style={styles.configSection}>
        <Text style={styles.sectionTitle}>Configuración del Juego</Text>

        <View style={styles.configItem}>
          <Text style={styles.configLabel}>Tipo de Juego</Text>
          <View style={styles.gameTypeContainer}>
            <TouchableOpacity
              style={[
                styles.gameTypeButton,
                selectedGameType === GameType.WHOS_THAT_POKEMON &&
                  styles.selectedButton,
              ]}
              onPress={() => setSelectedGameType(GameType.WHOS_THAT_POKEMON)}
            >
              <Text style={styles.gameTypeText}>¿Quién es ese Pokémon?</Text>
            </TouchableOpacity>
            {/* Más tipos de juego se pueden añadir aquí en el futuro */}
          </View>
        </View>

        <View style={styles.configItem}>
          <Text style={styles.configLabel}>Dificultad</Text>
          <View style={styles.difficultyContainer}>
            <TouchableOpacity
              style={[
                styles.difficultyButton,
                selectedDifficulty === GameDifficulty.EASY && styles.easyButton,
                selectedDifficulty === GameDifficulty.EASY &&
                  styles.selectedButton,
              ]}
              onPress={() => setSelectedDifficulty(GameDifficulty.EASY)}
            >
              <Text style={styles.difficultyText}>Fácil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.difficultyButton,
                selectedDifficulty === GameDifficulty.MEDIUM &&
                  styles.mediumButton,
                selectedDifficulty === GameDifficulty.MEDIUM &&
                  styles.selectedButton,
              ]}
              onPress={() => setSelectedDifficulty(GameDifficulty.MEDIUM)}
            >
              <Text style={styles.difficultyText}>Medio</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.difficultyButton,
                selectedDifficulty === GameDifficulty.HARD && styles.hardButton,
                selectedDifficulty === GameDifficulty.HARD &&
                  styles.selectedButton,
              ]}
              onPress={() => setSelectedDifficulty(GameDifficulty.HARD)}
            >
              <Text style={styles.difficultyText}>Difícil</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.configItem}>
          <Text style={styles.configLabel}>Número de Preguntas</Text>
          <View style={styles.questionCountContainer}>
            <TouchableOpacity
              style={[
                styles.questionCountButton,
                questionCount === 5 && styles.selectedButton,
              ]}
              onPress={() => setQuestionCount(5)}
            >
              <Text style={styles.questionCountText}>5</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.questionCountButton,
                questionCount === 10 && styles.selectedButton,
              ]}
              onPress={() => setQuestionCount(10)}
            >
              <Text style={styles.questionCountText}>10</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.questionCountButton,
                questionCount === 20 && styles.selectedButton,
              ]}
              onPress={() => setQuestionCount(20)}
            >
              <Text style={styles.questionCountText}>20</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.configItem}>
          <Text style={styles.configLabel}>Sonido</Text>
          <Switch
            value={soundEnabled}
            onValueChange={toggleSound}
            trackColor={{ false: '#767577', true: '#c62828' }}
            thumbColor={soundEnabled ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
        <Text style={styles.startButtonText}>¡Comenzar Juego!</Text>
        <MaterialIcons name="play-arrow" size={24} color="white" />
      </TouchableOpacity>

      <ScoreBoard scores={scores} gameType={selectedGameType} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  logo: {
    width: 250,
    height: 100,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  configSection: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  configItem: {
    marginBottom: 20,
  },
  configLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#555',
  },
  gameTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gameTypeButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  gameTypeText: {
    fontSize: 14,
    color: '#333',
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  difficultyButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  easyButton: {
    backgroundColor: '#a5d6a7',
  },
  mediumButton: {
    backgroundColor: '#fff59d',
  },
  hardButton: {
    backgroundColor: '#ef9a9a',
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  questionCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  questionCountButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  questionCountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedButton: {
    borderColor: '#c62828',
    borderWidth: 2,
    backgroundColor: 'rgba(198, 40, 40, 0.1)',
  },
  startButton: {
    backgroundColor: '#c62828',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
});
