import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
  },
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
  listContainer: {
    padding: 5,
  },
  card: {
    flex: 1,
    margin: 5,
    padding: 15,
    alignItems: 'center',
  },
  pokemonImage: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  pokemonName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pokemonId: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  // Nuevos estilos para el footer
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerLoading: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
});
