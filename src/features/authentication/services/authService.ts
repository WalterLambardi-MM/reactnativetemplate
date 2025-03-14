import { firebaseAuth } from '../../../config/firebase';
import {
  LoginCredentials,
  RegisterCredentials,
  User,
  AuthProvider,
} from '../types/auth.types';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { WEB_CLIENT_ID } from '../../../shared/constants/authentication';

// Configuración de Google Sign-In
GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
});

// Función auxiliar: Convertir usuario de Firebase a nuestro modelo
const mapFirebaseUser = (firebaseUser: any): User | null => {
  if (!firebaseUser) return null;

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    phoneNumber: firebaseUser.phoneNumber,
    emailVerified: firebaseUser.emailVerified,
    providerId: firebaseUser.providerData[0]?.providerId,
  };
};

// Función auxiliar: Manejar errores de Firebase
const handleError = (error: any): Error => {
  const errorCode = error.code;
  let message = 'Ha ocurrido un error desconocido';

  switch (errorCode) {
    case 'auth/email-already-in-use':
      message = 'El correo electrónico ya está en uso';
      break;
    case 'auth/invalid-email':
      message = 'El correo electrónico no es válido';
      break;
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      message = 'Credenciales incorrectas';
      break;
    case 'auth/weak-password':
      message = 'La contraseña es demasiado débil';
      break;
    case 'auth/too-many-requests':
      message = 'Demasiados intentos fallidos. Intenta más tarde';
      break;
    default:
      message = error.message || message;
  }

  return new Error(message);
};

// Registrar un nuevo usuario con email/password
export const register = async ({
  email,
  password,
  displayName,
}: RegisterCredentials): Promise<User> => {
  try {
    const { user } = await firebaseAuth.createUserWithEmailAndPassword(
      email,
      password,
    );

    // Actualizar el nombre si se proporciona
    if (displayName) {
      await user.updateProfile({ displayName });
    }

    return mapFirebaseUser(firebaseAuth.currentUser) as User;
  } catch (error: any) {
    throw handleError(error);
  }
};

// Iniciar sesión con email/password
export const login = async ({
  email,
  password,
}: LoginCredentials): Promise<User> => {
  try {
    await firebaseAuth.signInWithEmailAndPassword(email, password);
    return mapFirebaseUser(firebaseAuth.currentUser) as User;
  } catch (error: any) {
    throw handleError(error);
  }
};

// Iniciar sesión con Google
export const loginWithGoogle = async (): Promise<User> => {
  try {
    await GoogleSignin.hasPlayServices();
    await GoogleSignin.signIn();

    const { accessToken, idToken } = await GoogleSignin.getTokens();

    if (!idToken) {
      throw new Error('No ID token present!');
    }

    const googleCredential = auth.GoogleAuthProvider.credential(
      idToken,
      accessToken,
    );

    const userCredential = await auth().signInWithCredential(googleCredential);

    return mapFirebaseUser(userCredential.user) as User;
  } catch (error: any) {
    console.error('Error en loginWithGoogle:', error);

    // Manejar errores específicos de Google Sign-In
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      throw new Error('Inicio de sesión cancelado por el usuario');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      throw new Error('Operación de inicio de sesión en progreso');
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      throw new Error('Google Play Services no está disponible');
    }

    throw handleError(error);
  }
};

// Método genérico para iniciar sesión con cualquier proveedor
export const loginWithProvider = async (
  provider: AuthProvider,
): Promise<User> => {
  switch (provider) {
    case 'google':
      return loginWithGoogle();
    case 'email':
      throw new Error(
        'Usa el método login() para iniciar sesión con email/password',
      );
    default:
      throw new Error(`Proveedor de autenticación no soportado: ${provider}`);
  }
};

// Cerrar sesión
export const logout = async (): Promise<void> => {
  try {
    await firebaseAuth.signOut();
  } catch (error: any) {
    throw handleError(error);
  }
};

// Obtener el usuario actual
export const getCurrentUser = (): User | null => {
  return mapFirebaseUser(firebaseAuth.currentUser);
};

// Restablecer contraseña
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await firebaseAuth.sendPasswordResetEmail(email);
  } catch (error: any) {
    throw handleError(error);
  }
};

// Actualizar perfil
export const updateProfile = async (data: {
  displayName?: string;
  photoURL?: string;
}): Promise<User> => {
  try {
    const user = firebaseAuth.currentUser;
    if (!user) throw new Error('No hay usuario autenticado');

    await user.updateProfile(data);
    return mapFirebaseUser(firebaseAuth.currentUser) as User;
  } catch (error: any) {
    throw handleError(error);
  }
};

// Cambiar contraseña
export const updatePassword = async (newPassword: string): Promise<void> => {
  try {
    const user = firebaseAuth.currentUser;
    if (!user) throw new Error('No hay usuario autenticado');

    await user.updatePassword(newPassword);
  } catch (error: any) {
    throw handleError(error);
  }
};

// Verificar email
export const sendEmailVerification = async (): Promise<void> => {
  try {
    const user = firebaseAuth.currentUser;
    if (!user) throw new Error('No hay usuario autenticado');

    await user.sendEmailVerification();
  } catch (error: any) {
    throw handleError(error);
  }
};

// Escuchar cambios en la autenticación
export const onAuthStateChanged = (
  callback: (user: User | null) => void,
): (() => void) => {
  return firebaseAuth.onAuthStateChanged((firebaseUser) =>
    callback(mapFirebaseUser(firebaseUser)),
  );
};

// Exportar un objeto para mantener compatibilidad con código existente
export const authService = {
  register,
  login,
  loginWithGoogle,
  loginWithProvider,
  logout,
  getCurrentUser,
  resetPassword,
  updateProfile,
  updatePassword,
  sendEmailVerification,
  onAuthStateChanged,
};
