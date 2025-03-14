import { useEffect } from 'react';
import { BackHandler, Alert } from 'react-native';

interface UseBackHandlerProps {
  isEnabled: boolean;
  onBack: () => void;
  confirmationMessage?: {
    title: string;
    message: string;
    cancelText?: string;
    confirmText?: string;
  };
}

export const useBackHandler = ({
  isEnabled,
  onBack,
  confirmationMessage,
}: UseBackHandlerProps): void => {
  useEffect(() => {
    const handleBackPress = () => {
      if (!isEnabled) return false;

      if (confirmationMessage) {
        Alert.alert(confirmationMessage.title, confirmationMessage.message, [
          {
            text: confirmationMessage.cancelText || 'Cancelar',
            style: 'cancel',
            onPress: () => {},
          },
          {
            text: confirmationMessage.confirmText || 'Confirmar',
            style: 'destructive',
            onPress: onBack,
          },
        ]);
        return true; // Prevenir el comportamiento por defecto
      }

      // Sin confirmación, ejecutar directamente
      onBack();
      return true;
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
  }, [isEnabled, onBack, confirmationMessage]);
};
