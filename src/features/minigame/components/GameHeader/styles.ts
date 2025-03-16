import { StyleSheet } from 'react-native';

export default StyleSheet.create({
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
});
