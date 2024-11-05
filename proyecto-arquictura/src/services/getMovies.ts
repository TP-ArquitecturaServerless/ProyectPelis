//Componente para obtener las peliculas que estan guardadas en la db de firestore.
import {Firestore,collection, getDocs} from 'firebase/firestore';
import { db } from '../services/firebase';
import { Movie } from './interfaces/Movies';

//funcion para obtener una lista de Peliculas desde la base de datos de firestore
async function getMovies(database:Firestore=db):Promise<Movie[]>{
    const MovieCollection = collection(database, 'movies');
    const MovieSnapshot = await getDocs(MovieCollection);
    const MovieList= MovieSnapshot.docs.map(doc=>doc.data() as Movie);
    return MovieList;
}

export {getMovies}


