import { StyleSheet } from 'react-native';

export default StyleSheet.create({
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
});
