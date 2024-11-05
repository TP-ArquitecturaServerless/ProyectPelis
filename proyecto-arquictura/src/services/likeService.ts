//componente para guardar los likes en la base de datos firestore.
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore"
import { db } from "./firebase"

async function addLike(userID: string, movieID: string) {
  const userLikesRef = doc(db, "likes", userID)

  try {
    const userLikesDoc = await getDoc(userLikesRef)

    if (userLikesDoc.exists()) {
       // Actualiza el documento si existe y añade la película sin duplicados
      await updateDoc(userLikesRef, {
        likedMovies: arrayUnion(movieID)
      })
    } else {
      // Crea el documento con el array likedMovies si no existe
      await setDoc(userLikesRef, {
        likedMovies: [movieID]
      })
    }
  } catch (error) {
    console.error("Error al agregar 'like':", error)
  }
}

export default addLike
