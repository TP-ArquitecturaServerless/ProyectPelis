import admin from 'firebase-admin';
import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

// Inicializa Firebase
const serviceAccountPath = process.env.FIREBASE_CREDENTIALS;
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Función para cargar películas desde TMDB
const loadMovies = async () => {
  const apiKey = process.env.TMDB_API_KEY;
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=27`; // 27 es el ID del género de terror

  try {
    const response = await axios.get(url);
    const movies = response.data.results;

    // Guarda las películas en Firestore
    const batch = db.batch();
    movies.forEach((movie) => {
      const docRef = db.collection('movies').doc(movie.id.toString());
      batch.set(docRef, movie);
    });

    await batch.commit();
    console.log('Películas cargadas exitosamente en Firestore.');
  } catch (error) {
    console.error('Error cargando las películas:', error);
  }
};

loadMovies();
