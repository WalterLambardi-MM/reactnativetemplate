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

GoogleSignin.configure({
  webClientId:
    '508664549153-0accs7a6cr8oemjp51dco090apv7vq8e.apps.googleusercontent.com',
});

class AuthService {
  // Convertir usuario de Firebase a nuestro modelo
  private mapFirebaseUser(firebaseUser: any): User | null {
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
  }

  // Registrar un nuevo usuario con email/password
  async register({
    email,
    password,
    displayName,
  }: RegisterCredentials): Promise<User> {
    try {
      const { user } = await firebaseAuth.createUserWithEmailAndPassword(
        email,
        password,
      );

      // Actualizar el nombre si se proporciona
      if (displayName) {
        await user.updateProfile({ displayName });
      }

      return this.mapFirebaseUser(firebaseAuth.currentUser) as User;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Iniciar sesión con email/password
  async login({ email, password }: LoginCredentials): Promise<User> {
    try {
      await firebaseAuth.signInWithEmailAndPassword(email, password);
      return this.mapFirebaseUser(firebaseAuth.currentUser) as User;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Iniciar sesión con Google
  async loginWithGoogle(): Promise<User> {
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

      const userCredential =
        await auth().signInWithCredential(googleCredential);
      // Iniciar sesión en Firebase con la credencial
      //const userCredential =
      //await firebaseAuth.signInWithCredential(googleCredential);

      return this.mapFirebaseUser(userCredential.user) as User;
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

      throw this.handleError(error);
    }
  }

  // Método genérico para iniciar sesión con cualquier proveedor
  async loginWithProvider(provider: AuthProvider): Promise<User> {
    switch (provider) {
      case 'google':
        return this.loginWithGoogle();
      case 'email':
        throw new Error(
          'Usa el método login() para iniciar sesión con email/password',
        );
      default:
        throw new Error(`Proveedor de autenticación no soportado: ${provider}`);
    }
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      await firebaseAuth.signOut();
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Obtener el usuario actual
  getCurrentUser(): User | null {
    return this.mapFirebaseUser(firebaseAuth.currentUser);
  }

  // Restablecer contraseña
  async resetPassword(email: string): Promise<void> {
    try {
      await firebaseAuth.sendPasswordResetEmail(email);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Actualizar perfil
  async updateProfile(data: {
    displayName?: string;
    photoURL?: string;
  }): Promise<User> {
    try {
      const user = firebaseAuth.currentUser;
      if (!user) throw new Error('No hay usuario autenticado');

      await user.updateProfile(data);
      return this.mapFirebaseUser(firebaseAuth.currentUser) as User;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Cambiar contraseña
  async updatePassword(newPassword: string): Promise<void> {
    try {
      const user = firebaseAuth.currentUser;
      if (!user) throw new Error('No hay usuario autenticado');

      await user.updatePassword(newPassword);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Verificar email
  async sendEmailVerification(): Promise<void> {
    try {
      const user = firebaseAuth.currentUser;
      if (!user) throw new Error('No hay usuario autenticado');

      await user.sendEmailVerification();
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Escuchar cambios en la autenticación
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return firebaseAuth.onAuthStateChanged((firebaseUser) =>
      callback(this.mapFirebaseUser(firebaseUser)),
    );
  }

  // Manejar errores de Firebase
  private handleError(error: any): Error {
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
  }
}

export const authService = new AuthService();
