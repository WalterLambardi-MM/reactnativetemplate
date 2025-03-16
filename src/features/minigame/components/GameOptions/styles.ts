import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 20,
  },
  optionsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButton: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    margin: 8,
    borderRadius: 8,
    minWidth: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  correctOption: {
    backgroundColor: '#4caf50',
    borderColor: '#388e3c',
  },
  incorrectOption: {
    backgroundColor: '#f44336',
    borderColor: '#d32f2f',
  },
});
