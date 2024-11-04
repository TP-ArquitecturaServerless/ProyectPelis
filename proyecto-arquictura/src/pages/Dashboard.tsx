import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMovies } from '../services/getMovies';
import { Movie } from '../services/interfaces/Movies';

export default function Dashboard() {
  const { logout } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
 
  const [releaseYear, setReleaseYear] = useState<string>('');
  const [titleSearch, setTitleSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 9;

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

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) return <p>Cargando películas...</p>;
  if (error) return <p>{error}</p>;

  const startIndex = (currentPage - 1) * moviesPerPage;
  const currentMovies = filteredMovies.slice(startIndex, startIndex + moviesPerPage);

  return (
    <div className="min-h-screen bg-black text-orange-300 relative overflow-hidden">
      <header className="bg-orange-900 p-4 shadow-lg relative z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-orange-500">🎃PeliSoft Halloween🎃</h1>
          <nav>
            <Link to="/" onClick={logout} className="text-orange-300 hover:text-orange-500 transition duration-300">
              Cerrar Sesión
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto mt-10 px-4 relative z-10">
        <h2 className="text-4xl font-bold text-orange-500 mb-6">Tu Portal de Pesadillas y Fantasía</h2>
        
        {/* Filtros */}
        <div className="mb-6 flex flex-col gap-4">
          <label>
            Año de Lanzamiento:
            <input 
              type="text" 
              value={releaseYear} 
              onChange={(e) => setReleaseYear(e.target.value)} 
              placeholder="Ej. 2020"
              className="bg-gray-800 text-orange-300 p-2 rounded"
            />
          </label>
          <label>
            Buscar por Título:
            <input 
              type="text" 
              value={titleSearch} 
              onChange={(e) => setTitleSearch(e.target.value)} 
              placeholder="Ej. Inception"
              className="bg-gray-800 text-orange-300 p-2 rounded"
            />
          </label>
        </div>

        {/* Listado de tarjetas de películas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {currentMovies.map((movie) => (
            <div key={movie.id} className="bg-orange-800 text-white rounded-lg shadow-md p-4">
              <img 
                src={movie.poster_path} 
                alt={movie.title} 
                className="w-full h-64 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-bold mb-2">{movie.title}</h3>
              <p className='text-sm mb-1'>Descripcion: {movie.overview}</p>
              <p className="text-sm mb-1">Lanzamiento: {movie.release_date}</p>
              <p className="text-sm mb-1">Popularidad: {movie.popularity}</p>
              <p className="text-sm">Idioma: {movie.original_language}</p>
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
    </div>
  );
}
