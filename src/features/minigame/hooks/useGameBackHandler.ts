import { useBackHandler as useSharedBackHandler } from '../../../shared/hooks/useBackHandler';

export const useGameBackHandler = ({
  isGameInProgress,
  onExit,
}: {
  isGameInProgress: boolean;
  onExit: () => void;
}): void => {
  useSharedBackHandler({
    isEnabled: isGameInProgress,
    onBack: onExit,
    confirmationMessage: {
      title: 'Salir del juego',
      message:
        '¿Estás seguro de que quieres salir? Perderás tu progreso actual.',
      cancelText: 'Cancelar',
      confirmText: 'Salir',
    },
  });
};
