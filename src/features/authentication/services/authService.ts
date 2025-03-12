import { firebaseAuth } from '../../../config/firebase';
import {
  LoginCredentials,
  RegisterCredentials,
  User,
} from '../types/auth.types';

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
    };
  }

  // Registrar un nuevo usuario
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

  // Iniciar sesión
  async login({ email, password }: LoginCredentials): Promise<User> {
    try {
      await firebaseAuth.signInWithEmailAndPassword(email, password);
      return this.mapFirebaseUser(firebaseAuth.currentUser) as User;
    } catch (error: any) {
      throw this.handleError(error);
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
