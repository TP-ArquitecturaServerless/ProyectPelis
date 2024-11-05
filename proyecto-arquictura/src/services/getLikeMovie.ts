//Componente para obtener las peliculas que fueron likeada d ecada usuario .
import { db } from './firebase';
//ayudan a acceder a documentos especif de firebase
import { doc, getDoc } from 'firebase/firestore';

// Función para obtener las películas "likeadas" por un usuario
async function getLikedMovies(userID: string): Promise<string[]> {
  const userLikesRef = doc(db, "likes", userID);
  const userLikesSnap = await getDoc(userLikesRef);

  if (userLikesSnap.exists()) {
    return userLikesSnap.data().likedMovies as string[];
  } else {
    console.log("No hay likes para este usuario");
    return [];
  }
}


export default getLikedMovies;
