import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
    marginBottom: 5,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  scoreItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rank: {
    flex: 0.5,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  score: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
    color: '#c62828',
    fontWeight: 'bold',
  },
  accuracy: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
  },
  date: {
    flex: 1.5,
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
});
