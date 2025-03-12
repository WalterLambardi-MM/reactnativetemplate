export interface PokemonBasic {
  id: number;
  name: string;
  imageUrl: string;
}

export interface PokemonDetail extends PokemonBasic {
  height: number;
  weight: number;
  types: string[];
  stats: {
    name: string;
    value: number;
  }[];
  abilities: string[];
}

// Transformadores para mapear entre API y dominio
export const mapApiToPokemonBasic = (apiData: any): PokemonBasic => {
  console.log('Mapping Pokemon data:', apiData.name);

  // Manejar posibles valores nulos o indefinidos en la ruta de la imagen
  const sprites = apiData.sprites || {};
  const other = sprites.other || {};
  const officialArtwork = other['official-artwork'] || {};

  return {
    id: apiData.id,
    name: apiData.name
      ? apiData.name.charAt(0).toUpperCase() + apiData.name.slice(1)
      : 'Unknown',
    imageUrl:
      officialArtwork.front_default ||
      sprites.front_default ||
      'https://via.placeholder.com/150?text=Pokemon',
  };
};

export const mapApiToPokemonDetail = (apiData: any): PokemonDetail => ({
  ...mapApiToPokemonBasic(apiData),
  height: apiData.height / 10, // Convertir a metros
  weight: apiData.weight / 10, // Convertir a kg
  types: apiData.types.map((t: any) => t.type.name),
  stats: apiData.stats.map((s: any) => ({
    name: s.stat.name,
    value: s.base_stat,
  })),
  abilities: apiData.abilities.map((a: any) => a.ability.name),
});
