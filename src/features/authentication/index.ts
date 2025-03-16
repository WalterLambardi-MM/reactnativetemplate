// Components
export { AuthForm } from './components/AuthForm';
export { GoogleSignInButton } from './components/GoogleSignInButton';
export { ProfileForm } from './components/ProfileForm';

// Screens
export { ProfileScreen } from './screens/ProfileScreen';
export { LoginScreen } from './screens/LoginScreen';
export { RegisterScreen } from './screens/RegisterScreen';
export { PasswordResetScreen } from './screens/PasswordResetScreen';

// Hooks
export { useAuthForm } from './hooks/useAuthForm';
export { useGoogleSignIn } from './hooks/useGoogleSignIn';
export { useLoginViewModel } from './hooks/useLoginViewModel';
export { useProfileViewModel } from './hooks/useProfileViewModel';

// Store
export { useAuthStore, useAuthUser, useAuthStatus } from './store/auth.store';

// Services
export { authService } from './services/authService';

// Types
export type {
  User,
  AuthState,
  LoginCredentials,
  RegisterCredentials,
  AuthFormState,
  AuthProvider,
} from './types/auth.types';

// Utils
export {
  validateAuthForm,
  validateLoginForm,
  validateRegisterForm,
  validateResetPasswordForm,
  ValidationFormType,
} from './utils/authValidation';

export type { ValidationErrors } from './utils/authValidation';
