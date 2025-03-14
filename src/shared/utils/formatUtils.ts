/**
 * Formatea el tiempo en milisegundos a un formato legible
 */
export const formatTime = (timeMs: number): string => {
  const totalSeconds = Math.ceil(timeMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Extrae el ID de un Pokémon de su URL
 */
export const extractPokemonId = (url: string): number => {
  return parseInt(url.split('/').filter(Boolean).pop() || '0');
};
