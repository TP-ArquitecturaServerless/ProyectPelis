//interfaces para el tipo de datos de las peliculas
 export interface Movie {
    adult: boolean; // Indica si la película es para adultos (true) o no (false).
    backdrop_path: string; // Ruta de la imagen de fondo de la película, usada comúnmente en vistas detalladas.
    genre_ids: number[]; // Array de IDs numéricos que representan los géneros a los que pertenece la película.
    id: number; // ID único de la película, usado para identificarla en bases de datos o servicios.
    original_language: string; // Idioma original de la película, representado por un código ISO (ej. "es" para español).
    original_title: string; // Título original de la película en su idioma de origen.
    overview: string; // Descripción o sinopsis de la película.
    popularity: number; // Puntaje de popularidad, que indica cuánta atención ha recibido la película.
    poster_path: string; // Ruta de la imagen del póster de la película, mostrada en listados o detalles.
    release_date: string; // Fecha de lanzamiento en formato de cadena, típicamente en formato "YYYY-MM-DD".
    title: string; // Título de la película en el idioma de la audiencia actual.
    video: boolean; // Indica si la película es un video (true) o no (false).
    vote_average: number; // Promedio de votos de los usuarios para esta película.
    vote_count: number; // Número total de votos recibidos por la película.
    database_location: string; // Ubicación geográfica de la base de datos (ej. "southamerica-east1").
}

  