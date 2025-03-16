import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    backgroundColor: 'white',
    overflow: 'hidden',
    elevation: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    marginVertical: 10,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  clearButton: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
