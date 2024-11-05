//componente para filtrar las recomendaciones basados en los likes del usuario.
import { Movie } from '../services/interfaces/Movies';

interface RecommendationsProps {
  likedMovies: string[];
  movies: Movie[];
}

const Recommendations: React.FC<RecommendationsProps> = ({ likedMovies, movies }) => {
    return (
        <section className="mt-10 relative">
          {/* Fondo de efecto sangre */}
          <div className=""></div>
          <h2 className="text-2xl font-bold text-orange-500 mb-6 relative z-10">
            Recomendaciones
          </h2>
          <div className="overflow-x-auto whitespace-nowrap z-10 relative">
            <div className="flex space-x-4">
              {likedMovies.map((movieID) => {
                const movie = movies.find((m) => m.id === Number(movieID)); 
                return movie ? (
                  <div key={movie.id} className="relative">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={`Poster de ${movie.title}`}
                     className="w-48 h-64 object-cover rounded-md mb-2 shadow-lg shadow-red-500 transition-transform duration-300 hover:scale-105"
                    />
                    <h3 className="text-lg font-semibold text-orange-500 text-center mt-2">{movie.title}</h3>
                    <p className="text-xs text-center">Lanzamiento: {movie.release_date}</p>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </section>
      );
};

export default Recommendations;
