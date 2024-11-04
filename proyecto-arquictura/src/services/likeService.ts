import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore"
import { db } from "./firebase"

async function addLike(userID: string, movieID: string) {
  const userLikesRef = doc(db, "likes", userID)

  try {
    const userLikesDoc = await getDoc(userLikesRef)

    if (userLikesDoc.exists()) {
      await updateDoc(userLikesRef, {
        likedMovies: arrayUnion(movieID)
      })
    } else {
      await setDoc(userLikesRef, {
        likedMovies: [movieID]
      })
    }
  } catch (error) {
    console.error("Error al agregar 'like':", error)
  }
}

export default addLike
