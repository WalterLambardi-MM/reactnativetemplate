import { StyleSheet } from 'react-native';

export default StyleSheet.create({
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
});
