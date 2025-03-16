// Components
export {
  Card,
  ErrorView,
  LoadingIndicator,
  HeaderMinigameButton,
  HeaderProfileButton,
} from './components';

// Hooks
export { useForm } from './hooks/useForm';
export { useFormValidation } from './hooks/useFormValidation';
export { useBackHandler } from './hooks/useBackHandler';

// API
export { createApiClient } from './api/client';
export { ApiError } from './api/error-handling';

// Constants
export {
  API_BASE_URL,
  POKEMON_SPRITE_URL,
  DEFAULT_PAGE_SIZE,
  API_TIMEOUT,
} from './constants/api';
export { WEB_CLIENT_ID } from './constants/authentication';

// Types
export type {
  ApiResponse,
  PaginatedResponse,
  ApiError as ApiErrorType,
} from './types/api.types';
export type {
  MainStackParamList,
  AuthStackParamList,
  RootStackParamList,
  MainNavigationProp,
  AuthNavigationProp,
  MainRouteProp,
  AuthRouteProp,
} from './types/navigation.types';

// Utils
export { shuffleArray, capitalizeFirstLetter } from './utils/arrayUtils';
export { formatTime, extractPokemonId } from './utils/formatUtils';

// Store middleware
export {
  createReactotronMiddleware,
  withReactotronMiddleware,
} from './store/middleware/reactotronMiddleware';
