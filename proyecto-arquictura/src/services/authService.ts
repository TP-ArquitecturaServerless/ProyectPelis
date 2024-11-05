//Configuracion para la authenticacion de un usuario , utilizando los metodos brindados por firebase.
import { auth } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';

const provider = new GoogleAuthProvider();

//funcion para registrarme con correo y contraseña.
export const registerWithEmail = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

//funcion para iniciar sesion con correo y contraseña.
export const loginWithEmail = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

//funcion para iniciar sesion con google.
export const loginWithGoogle = () => {
  return signInWithPopup(auth, provider);
};


