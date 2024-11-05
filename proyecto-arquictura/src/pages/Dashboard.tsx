import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMovies } from '../services/getMovies';
import { Movie } from '../services/interfaces/Movies';
import { Eye,X ,Heart} from 'lucide-react';
import Recommendations from '../component/Recomendaciones';
import addLike from '../services/likeService';
import getLikedMovies from '../services/getLikeMovie';
import ScaryEffect from './ScaryEffect';


export default function Dashboard() {
  const { logout ,user} = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [likedMovies, setLikedMovies] = useState<(string)[]>([]);

 
  const [releaseYear, setReleaseYear] = useState<string>('');
  const [titleSearch, setTitleSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 9;

    // Cargar likes desde Firestore al cargar el componente
    useEffect(() => {
      const fetchLikedMovies = async () => {
        if (user) {
          const likes = await getLikedMovies(user.uid);
          setLikedMovies(likes);
        }
      };
      fetchLikedMovies();
    }, [user]);
  
    //funcion para filtrar las peliculas
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const fetchedMovies = await getMovies();
        setMovies(fetchedMovies);
      } catch (error) {
        console.error("Error al obtener películas:", error);
        setError('Error al obtener peliculas.');
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);
 
  //funcion de buscador por titulo y fecha de lanzamiento
  useEffect(() => {
    const applyFilters = () => {
      const filtered = movies.filter(movie => {
        const movieYear = movie.release_date.slice(0, 4);
        return (
          (!releaseYear || movieYear === releaseYear) &&
          (!titleSearch || movie.title.toLowerCase().includes(titleSearch.toLowerCase()))
        );
      });
      setFilteredMovies(filtered);
    };
    applyFilters();
  }, [movies, releaseYear, titleSearch]);
  
  // función paginate actualiza el estado de la página actual.
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  //cargar pelicula
  if (loading) return <p>Cargando películas...</p>;
  if (error) return <p>{error}</p>;
  
  /// función para Calcular el índice inicial de los elementos que se mostrarán en la página actual.
  const startIndex = (currentPage - 1) * moviesPerPage;
  //funcion para Obtener solo los elementos que deben mostrarse en la página actual.
  const currentMovies = filteredMovies.slice(startIndex, startIndex + moviesPerPage);

 // Función toggleLike modificada para almacenar en Firestore los like.
 const toggleLike = async (movieID: string) => {
  if (!user) return;

  const isLiked = likedMovies.includes(movieID);
  const updatedLikedMovies = isLiked
    ? likedMovies.filter(id => id !== movieID)
    : [...likedMovies, movieID];

  setLikedMovies(updatedLikedMovies);

  try {
    // Agrega el like en Firestore
    await addLike(user.uid, movieID); 
  } catch (error) {
    console.error("Error al actualizar el like en Firestore:", error);
  }
};


  //funcion para  abrir el modal 
  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };
  //funcion para cerrar el modal
  const closeModal = () => {
    setSelectedMovie(null);
    setIsModalOpen(false);
  };


  return (
    <div className="min-h-screen bg-black text-orange-300 relative overflow-hidden font-sans">
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

          {/* Buscadores */}
          <div className="flex space-x-4">
            {/* budcsdor por año de lanzamiento*/}
            <label className="flex flex-col text-orange-500 font-semibold">
              Año de Lanzamiento:
              <input 
                type="text" 
                value={releaseYear} 
                onChange={(e) => setReleaseYear(e.target.value)} 
                placeholder="Ej. 2020"
                className="bg-gray-800 text-orange-300 p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
            </label>
            {/* buscador por titulo */}
            <label className="flex flex-col text-orange-500 font-semibold">
              Buscar por Título:
              <input 
                type="text" 
                value={titleSearch} 
                onChange={(e) => setTitleSearch(e.target.value)} 
                placeholder="Ej. Inception"
                className="bg-gray-800 text-orange-300 p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
            </label>
          </div>
          {/* Boton de cerrar sesion */}
          <nav>
            <Link to="/" onClick={logout} className="text-orange-300 hover:text-orange-500 transition duration-300">
              Cerrar Sesión
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto mt-10 px-4 relative z-10">
        
        {/* Recomendaciones Basadas en Likes */}
        <Recommendations likedMovies={likedMovies} movies={movies} />
        {/* linea separadora */}
        <div className="border-b border-orange-500 my-4"></div>

        {/* Listado de tarjetas de películas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentMovies.map((movie) => (
            <div key={movie.id} className="bg-orange-900 rounded-lg shadow-lg p-4 hover:shadow-orange-500/50 transition duration-300">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={`Poster de ${movie.title}`}
                className="w-full h-64 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold text-orange-500">{movie.title}</h3>
              <p className='text-sm mb-1 line-clamp-3'>Descripcion: {movie.overview}</p>
              <p className="text-sm mb-1">Lanzamiento: {movie.release_date}</p>
              
              {/* aqui deve ir el boton para dar like */}
               <button
                onClick={() => toggleLike(movie.id.toString())} 
                className={`mt-2 p-2 rounded ${likedMovies.includes(movie.id.toString()) ? 'bg-red-500' : 'bg-orange-800'} hover:bg-orange-700 transition duration-300 flex items-center justify-center w-full`}
              >
                <Heart className="h-4 w-4 mr-2" />
                {likedMovies.includes(movie.id.toString()) ? 'Liked' : 'Like'}
              </button>

              {/* boton de ver */}
              <button
                onClick={() => openModal(movie)}
                className="mt-4 p-2 rounded bg-orange-800 hover:bg-orange-700 transition duration-300 flex items-center justify-center w-full"
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver
              </button>
            </div>
          ))}
        </div>

        {/* Paginación */}
        <div className="flex justify-center mt-8">
          {Array.from({ length: Math.ceil(filteredMovies.length / moviesPerPage) }, (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`mx-1 px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-orange-600 text-black' : 'bg-orange-800 text-orange-300'} hover:bg-orange-700 transition duration-300`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        
      </main>

      {/* Modal de película */}
      {isModalOpen && selectedMovie && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-orange-900 text-orange-300 p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
          <h2 className="text-3xl font-bold text-orange-500">{selectedMovie.title}</h2>
            <button 
              onClick={closeModal} 
               className="text-orange-300 hover:text-orange-500"
            >
              <X className="h-6 w-6" />
            </button>
            </div>
            <img 
              src={`https://image.tmdb.org/t/p/w500${selectedMovie.backdrop_path}`} 
              alt={selectedMovie.title} 
              className="w-full h-64 object-cover rounded-md mb-4"
            />
            {/* aqui se mostrara la fecha, pipular y clasificacion */}
            <div className="flex space-x-6 text-white mt-4">
              {/* Popularidad */}
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold text-orange-400">Popularidad</span>
                <span className="text-lg font-bold">{selectedMovie.popularity}</span> {/* Cambia '85%' por la variable correspondiente */}
              </div>
              {/* divisor */}
              <div className="h-8 w-px bg-orange-700 mx-4"></div>

              {/* Año */}
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold text-orange-400">Año</span>
                <span className="text-lg font-bold">{selectedMovie.release_date}</span> {/* Cambia '1982' por la variable correspondiente */}
              </div>

              <div className="h-8 w-px bg-orange-700 mx-4"></div>

              {/* Clasificación */}
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold text-orange-400">Clasificación</span>
                <span className={`text-lg font-bold px-2 py-1 rounded ${selectedMovie.adult ? 'text-red-600 bg-red-900' : ''}`}>
                  {selectedMovie.adult ? '+18' : 'Apto para todos'}
                </span>
              </div>
            </div>

            {/* y aqui los demas datos */}
            <p className="text-orange-300 mb-2"><strong className="text-orange-400">Resumen:</strong> {selectedMovie.overview}</p>
            <p><strong className="text-orange-400">Categoría:</strong> {selectedMovie.genre_ids.join(', ')}</p>
            <p><strong className="text-orange-400">Idioma original:</strong> {selectedMovie.original_language}</p>
            <p><strong className="text-orange-400">Promedio de votos:</strong> {selectedMovie.vote_average}</p>
            <p><strong className="text-orange-400">Número de votos:</strong> {selectedMovie.vote_count}</p>
          
            <div className="mt-4 flex justify-center">
              <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded">
              <ScaryEffect/>
                Ver ahora ▶️
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
