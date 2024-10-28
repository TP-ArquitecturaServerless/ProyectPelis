import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ThumbsUp, ThumbsDown, Clock, Star, Eye, X, Play } from 'lucide-react'

type Movie = {
  id: number
  title: string
  category: string
  saga?: string
  isFavorite: boolean
  posterUrl: string
  likes: number
  dislikes: number
  comments: { username: string; comment: string }[]
  watchLater: boolean
  overview: string
  releaseDate: string
  videoUrl?: string
}

const initialMovies: Movie[] = [
  { id: 1, title: "Harry Potter y la piedra filosofal", category: "Fantasía", saga: "Harry Potter", isFavorite: false, posterUrl: "https://i.pinimg.com/564x/62/71/5a/62715a1e6adcbc31c6f8c751a63caa5f.jpg", likes: 0, dislikes: 0, comments: [], watchLater: false, overview: "El inicio de la saga del joven mago.", releaseDate: "2001-11-16", videoUrl: "https://example.com/harry1.mp4" },
  { id: 2, title: "Crepúsculo", category: "Romance Fantástico", saga: "Crepúsculo", isFavorite: false, posterUrl: "https://i.pinimg.com/736x/bc/d9/38/bcd938e3e9cd920961b5f46225bbfb41.jpg", likes: 0, dislikes: 0, comments: [], watchLater: false, overview: "Una historia de amor entre una humana y un vampiro.", releaseDate: "2008-11-21", videoUrl: "https://example.com/twilight.mp4" },
  { id: 3, title: "Los Simpson: La película", category: "Animación", isFavorite: false, posterUrl: "https://i.pinimg.com/564x/59/d5/1d/59d51da1f0af020a3170f278b75b007b.jpg", likes: 0, dislikes: 0, comments: [], watchLater: false, overview: "La familia Simpson salva a Springfield de una catástrofe.", releaseDate: "2007-07-27", videoUrl: "https://example.com/simpsons.mp4" },
  { id: 4, title: "El Conjuro", category: "Terror", isFavorite: false, posterUrl: "https://i.pinimg.com/736x/98/14/dc/9814dcfafc0438d156c396f1ad911e76.jpg", likes: 0, dislikes: 0, comments: [], watchLater: false, overview: "Basada en casos reales de los Warren.", releaseDate: "2013-07-19", videoUrl: "https://example.com/conjuring.mp4" },
  { id: 5, title: "Hereditary", category: "Terror Psicológico", isFavorite: false, posterUrl: "https://i.pinimg.com/564x/ee/02/76/ee0276c8ed47d9470f430fd4189fec1e.jpg", likes: 0, dislikes: 0, comments: [], watchLater: false, overview: "Una familia enfrenta terrores sobrenaturales tras la muerte de la abuela.", releaseDate: "2018-06-08", videoUrl: "https://example.com/hereditary.mp4" },
]

export default function Dashboard() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies)
  const [filter, setFilter] = useState<string>('all')
  const [username] = useState<string>('Usuario')
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const moviesPerPage = 9

  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await fetch('https://api.themoviedb.org/3/discover/movie?api_key=f18531194e1b427b92ae4dad37e657e6&language=es-ES&with_genres=27,14,10749&page=1')
        const data = await response.json()

        const fetchedMovies = data.results.map((movie: { id: number; title: string; genre_ids: number[]; poster_path: string; overview: string; release_date: string }) => ({
          id: movie.id,
          title: movie.title,
          category: getCategory(movie.genre_ids),
          saga: getSaga(movie.title),
          isFavorite: false,
          posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          likes: 0,
          dislikes: 0,
          comments: [],
          watchLater: false,
          overview: movie.overview,
          releaseDate: movie.release_date,
          videoUrl: `https://example.com/${movie.id}.mp4` // Ejemplo de URL de video
        }))

        setMovies([...initialMovies, ...fetchedMovies])
      } catch (error) {
        console.error("Error fetching movies:", error)
      }
    }
    fetchMovies()
  }, [])

  const getCategory = (genreIds: number[]): string => {
    if (genreIds.includes(27)) return "Terror"
    if (genreIds.includes(14)) return "Fantasía"
    if (genreIds.includes(10749)) return "Romance"
    return "Otros"
  }

  const getSaga = (title: string): string | undefined => {
    if (title.includes("Harry Potter")) return "Harry Potter"
    if (title.includes("Crepúsculo") || title.includes("Twilight")) return "Crepúsculo"
    return undefined
  }

  const toggleFavorite = (id: number) => {
    setMovies(movies.map(movie =>
      movie.id === id ? { ...movie, isFavorite: !movie.isFavorite } : movie
    ))
  }

  const addLike = (id: number) => {
    setMovies(movies.map(movie =>
      movie.id === id ? { ...movie, likes: movie.likes + 1 } : movie
    ))
  }

  const addDislike = (id: number) => {
    setMovies(movies.map(movie =>
      movie.id === id ? { ...movie, dislikes: movie.dislikes + 1 } : movie
    ))
  }

  const toggleWatchLater = (id: number) => {
    setMovies(movies.map(movie =>
      movie.id === id ? { ...movie, watchLater: !movie.watchLater } : movie
    ))
  }

  const addComment = (id: number, comment: string) => {
    setMovies(movies.map(movie =>
      movie.id === id ? { ...movie, comments: [...movie.comments, { username, comment }] } : movie
    ))
  }

  const filteredMovies = movies.filter(movie => {
    if (filter === 'all') return true
    if (filter === 'favorites') return movie.isFavorite
    if (filter === 'watchLater') return movie.watchLater
    return movie.category === filter || movie.saga === filter
  })

  const getRecommendedMovies = () => {
    const likedMovies = movies.filter(movie => movie.likes > 0)
    const recommendedMovies = new Set<Movie>()

    likedMovies.forEach(likedMovie => {
      movies.forEach(movie => {
        if (movie.id !== likedMovie.id &&
            (movie.category === likedMovie.category || movie.saga === likedMovie.saga)) {
          recommendedMovies.add(movie)
        }
      })
    })

    return Array.from(recommendedMovies).slice(0, 5)
  }

  const recommendedMovies = getRecommendedMovies()

  const categories = ['Todo', 'favorites', 'watchLater', ...new Set(movies.map(m => m.category)), ...new Set(movies.map(m => m.saga).filter(Boolean) as string[])]

  const indexOfLastMovie = currentPage * moviesPerPage
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

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
        <h2 className="text-4xl font-bold text-orange-500 mb-6">Tu Portal de Pesadillas y Fantasía</h2>
        
        {/* Películas Recomendadas */}
        {recommendedMovies.length > 0 && (
          <div className="mt-10">
            <h3 className="text-2xl font-semibold text-orange-400 mb-2">Películas Recomendadas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedMovies.map(movie => (
                <div key={movie.id} className="bg-orange-900 rounded-lg shadow-lg p-4">
                  <img src={movie.posterUrl} alt={movie.title} className="w-full h-64 object-cover rounded-md mb-4" />
                  <h3 className="text-xl font-semibold text-orange-500">{movie.title}</h3>
                  <p className="text-orange-300">{movie.category}</p>
                  {movie.saga && <p className="text-orange-400">Saga: {movie.saga}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Categorías y Sagas */}
        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-orange-400 mb-2">Categorías y Sagas</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded ${filter === category ? 'bg-orange-600 text-black' : 'bg-orange-800 text-orange-300'} hover:bg-orange-700 transition duration-300`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Películas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentMovies.map(movie => (
            <div key={movie.id} className="bg-orange-900 rounded-lg shadow-lg p-4 hover:shadow-orange-500/50 transition duration-300">
              <img src={movie.posterUrl} alt={movie.title} className="w-full h-64 object-cover rounded-md mb-4" />
              <h3 className="text-xl font-semibold text-orange-500">{movie.title}</h3>
              <p className="text-orange-300">{movie.category}</p>
              {movie.saga && <p className="text-orange-400">Saga: {movie.saga}</p>}
              <p className="text-orange-400">Likes: {movie.likes} | Dislikes: {movie.dislikes}</p>
              
              <div className="flex flex-wrap gap-2 mt-2">
                <button onClick={() => addLike(movie.id)} className="p-2 rounded bg-orange-800 hover:bg-orange-700 transition duration-300">
                  <ThumbsUp className="h-4 w-4" />
                </button>
                <button onClick={() => addDislike(movie.id)} className="p-2 rounded bg-orange-800 hover:bg-orange-700 transition duration-300">
                  <ThumbsDown className="h-4 w-4" />
                </button>
                <button
                  onClick={() => toggleWatchLater(movie.id)}
                  className={`p-2 rounded ${movie.watchLater ? 'bg-orange-600' : 'bg-orange-800'} hover:bg-orange-700 transition duration-300`}
                >
                  <Clock className="h-4 w-4" />
                </button>
                <button
                  onClick={() => toggleFavorite(movie.id)}
                  className={`p-2 rounded ${movie.isFavorite ? 'bg-orange-600' : 'bg-orange-800'} hover:bg-orange-700 transition duration-300`}
                >
                  <Star className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedMovie(movie)
                    setIsModalOpen(true)
                  }}
                  className="p-2 rounded bg-orange-800 hover:bg-orange-700 transition duration-300"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4">
                <h4 className="text-orange-400">Comentarios:</h4>
                <ul className="text-orange-300">
                  {movie.comments.map((commentObj, idx) => (
                    <li key={idx}>- {commentObj.username}: {commentObj.comment}</li>
                  ))}
                </ul>
                <input 
                  type="text"
                  placeholder="Deja un comentario"
                  className="w-full mt-2 p-2 rounded bg-black text-orange-300"
                  
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addComment(movie.id, (e.target as HTMLInputElement).value)
                      ;(e.target as HTMLInputElement).value = ''
                    }
                  }}
                />
              </div>
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

      {/* Modal */}
      {isModalOpen && selectedMovie && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-orange-900 text-orange-300 p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-orange-500">{selectedMovie.title}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-orange-300 hover:text-orange-500">
                <X className="h-6 w-6" />
              </button>
            </div>
            {isPlaying ? (
              <video src={selectedMovie.videoUrl} controls autoPlay className="w-full rounded-md mb-4" />
            ) : (
              <img src={selectedMovie.posterUrl} alt={selectedMovie.title} className="w-full h-64 object-cover rounded-md mb-4" />
            )}
            <p className="text-orange-300 mb-2"><strong>Categoría:</strong> {selectedMovie.category}</p>
            {selectedMovie.saga && <p className="text-orange-300 mb-2"><strong>Saga:</strong> {selectedMovie.saga}</p>}
            <p className="text-orange-300 mb-2"><strong>Fecha de lanzamiento:</strong> {selectedMovie.releaseDate}</p>
            <p className="text-orange-300 mb-2"><strong>Resumen:</strong> {selectedMovie.overview}</p>
            <p className="text-orange-300 mb-2"><strong>Likes:</strong> {selectedMovie.likes} | <strong>Dislikes:</strong> {selectedMovie.dislikes}</p>
            <p className="text-orange-300 mb-2"><strong>Estado:</strong> {selectedMovie.isFavorite ? 'Favorita' : 'No favorita'}, {selectedMovie.watchLater ? 'En lista para ver más tarde' : 'No en lista para ver más tarde'}</p>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="mt-4 px-4 py-2 bg-orange-600 text-black rounded hover:bg-orange-500 transition duration-300"
            >
              {isPlaying ? 'Detener' : 'Ver ahora'}
              {!isPlaying && <Play className="inline-block ml-2 h-4 w-4" />}
            </button>
            <h4 className="text-orange-400 mt-4 mb-2">Comentarios:</h4>
            <ul className="text-orange-300">
              {selectedMovie.comments.map((commentObj, idx) => (
                <li key={idx}>- {commentObj.username}: {commentObj.comment}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}