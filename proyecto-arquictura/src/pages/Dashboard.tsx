import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

type Movie = {
  id: number;
  title: string;
  category: string;
  isFavorite: boolean;
  posterUrl: string;
  likes: number;
  comments: { username: string; comment: string }[];
};

const initialMovies: Movie[] = [
  { id: 1, title: "El Conjuro", category: "Paranormal", isFavorite: false, posterUrl: "", likes: 0, comments: [] },
  { id: 2, title: "It", category: "Terror Psicológico", isFavorite: false, posterUrl: "", likes: 0, comments: [] },
  { id: 3, title: "El Exorcista", category: "Posesión", isFavorite: false, posterUrl: "", likes: 0, comments: [] },
];

function MovieModal({ movie, onClose, onAddToFavorites, onWatchLater, onDislike }: { movie: Movie | null, onClose: () => void, onAddToFavorites: (id: number) => void, onWatchLater: (id: number) => void, onDislike: (id: number) => void }) {
  if (!movie) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <div className="bg-orange-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-orange-500">{movie.title}</h2>
        <img src={movie.posterUrl} alt={movie.title} className="w-full h-64 object-cover rounded-md mb-4" />
        <p className="text-orange-300">Categoría: {movie.category}</p>
        <p className="text-orange-400">Likes: {movie.likes}</p>
        <div className="flex justify-between mt-4">
          <button onClick={() => { onAddToFavorites(movie.id); onClose(); }} className="bg-orange-600 text-black px-4 py-2 rounded">Guardar como favoritos</button>
          <button onClick={() => { onWatchLater(movie.id); onClose(); }} className="bg-orange-800 text-orange-300 px-4 py-2 rounded">Ver más tarde</button>
          <button onClick={() => { onDislike(movie.id); onClose(); }} className="bg-red-600 text-white px-4 py-2 rounded">No me gusta</button>
        </div>
        <button onClick={onClose} className="mt-4 text-orange-500 underline">Cerrar</button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [filter, setFilter] = useState<string>('all');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null); // Estado para la película seleccionada

  // Fetch movies from the API
  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await fetch('https://api.themoviedb.org/3/discover/movie?api_key=f18531194e1b427b92ae4dad37e657e6&language=es-ES&with_genres=27');
        const data = await response.json();

        setMovies(data.results.map((movie: { id: number; title: string; genre_ids: number[]; poster_path: string; }) => ({
          id: movie.id,
          title: movie.title,
          category: "Terro",
          isFavorite: false,
          posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          likes: 0,
          comments: []
        })));
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }
    fetchMovies();
  }, []);

  const toggleFavorite = (id: number) => {
    setMovies(movies.map(movie =>
      movie.id === id ? { ...movie, isFavorite: !movie.isFavorite } : movie
    ));
  };

  const filteredMovies = movies.filter(movie => {
    if (filter === 'all') return true;
    if (filter === 'favorites') return movie.isFavorite;
    return movie.category === filter;
  });

  const recommendedMovies = movies.filter(movie => movie.likes > 0 || movie.isFavorite)
    .slice(0, 5); // Muestra las primeras 5 películas que tienen "me gusta" o son favoritas

  const categories = ['Todo', 'favorites', ...new Set(movies.map(m => m.category))];

  // Manejar ver más tarde
  const handleWatchLater = (id: number) => {
    console.log(`Ver más tarde: ${id}`);
  };

  // Manejar no me gusta
  const handleDislike = (id: number) => {
    setMovies(movies.map(movie =>
      movie.id === id ? { ...movie, likes: movie.likes > 0 ? movie.likes - 1 : 0 } : movie
    ));
  };

  return (
    <div className="min-h-screen bg-black text-orange-300 relative overflow-hidden">
      {/* Efecto de murciélagos */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="absolute animate-fly-bat"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          >
            🦇
          </div>
        ))}
      </div>

      <header className="bg-orange-900 p-4 shadow-lg relative z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-orange-500">🎃PeliSoft Halloween🎃</h1>
          <nav>
            <Link to="/" className="text-orange-300 hover:text-orange-500 transition duration-300">Cerrar Sesión</Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto mt-10 px-4 relative z-10">
        <h2 className="text-4xl font-bold text-orange-500 mb-6">Tu Portal de Pesadillas</h2>
        
        {/* Películas Recomendadas */}
        {recommendedMovies.length > 0 && (
          <div className="mt-10">
            <h3 className="text-2xl font-semibold text-orange-400 mb-2">Películas Recomendadas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedMovies.map(movie => (
                <div key={movie.id} className="bg-orange-900 rounded-lg shadow-lg p-4">
                  <img src={movie.posterUrl} alt={movie.title} className="w-full h-64 object-cover rounded-md mb-4" />
                  <h3 className="text-xl font-semibold text-orange-500">{movie.title}</h3>
                  <button 
                    onClick={() => setSelectedMovie(movie)} 
                    className="mt-2 px-4 py-2 rounded bg-orange-600 text-black hover:bg-orange-700 transition duration-300"
                  >
                    Ver
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Categorías de Terror */}
        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-orange-400 mb-2">Categorías de Terror</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded ${filter === category ? 'bg-orange-600 text-black' : 'bg-orange-800 text-orange-300'} hover:bg-orange-700 transition duration-300`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de películas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMovies.map(movie => (
            <div key={movie.id} className="bg-orange-900 rounded-lg shadow-lg p-4">
              <img src={movie.posterUrl} alt={movie.title} className="w-full h-64 object-cover rounded-md mb-4" />
              <h3 className="text-xl font-semibold text-orange-500">{movie.title}</h3>
              <p className="text-orange-300">Likes: {movie.likes}</p>
              <button 
                onClick={() => setSelectedMovie(movie)} 
                className="mt-2 px-4 py-2 rounded bg-orange-600 text-black hover:bg-orange-700 transition duration-300"
              >
                Ver
              </button>
            </div>
          ))}
        </div>
      </main>
      
      {/* Modal para mostrar detalles de la película */}
      <MovieModal 
        movie={selectedMovie} 
        onClose={() => setSelectedMovie(null)} 
        onAddToFavorites={toggleFavorite}
        onWatchLater={handleWatchLater}
        onDislike={handleDislike}
      />
    </div>
  );
}
