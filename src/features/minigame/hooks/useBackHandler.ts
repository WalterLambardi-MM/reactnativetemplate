import { useEffect } from 'react';
import { BackHandler, Alert } from 'react-native';

interface UseBackHandlerProps {
  isGameInProgress: boolean;
  onExit: () => void;
}

export const useBackHandler = ({
  isGameInProgress,
  onExit,
}: UseBackHandlerProps): void => {
  useEffect(() => {
    const handleBackPress = () => {
      if (isGameInProgress) {
        Alert.alert(
          'Salir del juego',
          '¿Estás seguro de que quieres salir? Perderás tu progreso actual.',
          [
            { text: 'Cancelar', style: 'cancel', onPress: () => {} },
            {
              text: 'Salir',
              style: 'destructive',
              onPress: onExit,
            },
          ],
        );
        return true; // Prevenir el comportamiento por defecto
      }
      return false; // Permitir el comportamiento por defecto
    };

    // Añadir listener para el botón de retroceso (Android)
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );

    // Limpiar al desmontar
    return () => {
      backHandler.remove();
    };
  }, [isGameInProgress, onExit]);
};
