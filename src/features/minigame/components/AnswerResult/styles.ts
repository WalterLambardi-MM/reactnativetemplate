import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  resultContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  correctText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4caf50',
  },
  incorrectText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#f44336',
  },
  timeoutText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ff9800',
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
});
