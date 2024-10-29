import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../styles/index.css'
import '../index.css'

export const Index = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showHalloweenEffects, setShowHalloweenEffects] = useState(false);
  const [audio] = useState(new Audio('/halloween-sound.mp3')); // Asegúrate de tener este archivo de audio en tu carpeta public

  const images = [
    "https://img.englishcinemakyiv.com/79TBypeNncaPXG8Sy1XV3x_FnLfC5vwsCAqHiE7Xl50/resize:fill:800:450:1:0/gravity:sm/aHR0cHM6Ly9leHBhdGNpbmVtYXByb2QuYmxvYi5jb3JlLndpbmRvd3MubmV0L2ltYWdlcy8zMjM5ODU1NC0yMDUwLTRhN2QtODU1Zi0yMGNmMTJmZmIzZmEuanBn.jpg",
    "https://i.ytimg.com/vi/cuDBjj_Gs0M/maxresdefault.jpg",
    "https://image.tmdb.org/t/p/original/1K5p4wPrxWttjoUGjfrrOJT5SYo.jpg",
    "https://beam-images.warnermediacdn.com/BEAM_LWM_DELIVERABLES/1890c8c5-2f40-4140-a363-064428201826/f50c3928-87a1-4e97-b005-fbdd6283940e?host=wbd-images.prod-vod.h264.io&partner=beamcom",
    "https://light.pawa.cl/img/2022/07/13045310/f1280x720-78977_210652_5050.jpg",
    "https://i0.wp.com/www.atiempo.mx/wp-content/uploads/2013/08/130822-el-conjuro-630x320-atiempo.mx_.jpg",
    "https://www.cinemaedintorni.com/wp-content/uploads/2018/09/arriva-un-banner-promozionale-asiatico-di-the-nun-la-vocazione-del-male.jpg",
    "https://i.pinimg.com/736x/72/0b/f5/720bf5d1881b6a9f6d749617199e0b5c.jpg",
    "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/b0c72d19851189.562e155e5af37.jpg",
    "https://greenhouse.hulu.com/app/uploads/sites/11/2023/10/HillsHaveEyes_Hulu_Horizontal-Standard-Tile-1920x1080px-1024x576.jpg"
  ];

  const halloweenCreatures = ['🦇', '🕷️'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleHalloweenClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowHalloweenEffects(true);
    audio.play().catch(error => console.error("Error playing audio:", error));
    setTimeout(() => {
      setShowHalloweenEffects(false);
      window.location.href = '/login';
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <header className="bg-orange-600 p-4 fixed w-full z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-black">🎃PeliSoft Halloween🎃 </h1>
          <nav>
            <Link to="/login" className="text-black hover:text-orange-200 mr-4 transition duration-300">Iniciar Sesión</Link>
            <Link to="/register" className="bg-black text-orange-500 px-4 py-2 rounded hover:bg-orange-900 transition duration-300">Registrarse</Link>
          </nav>
        </div>
      </header>
      <main className="pt-16">
        <div className="relative h-screen">
          {images.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img src={img} alt={`Película de Halloween ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-5xl font-bold text-orange-500 mb-6 animate-fade-in-down">🎃Bienvenido a PeliSoft Halloween🎃</h2>
              <p className="text-2xl text-orange-300 mb-8 animate-fade-in-up">Descubre y disfruta de las mejores películas de terror y suspenso.</p>
              <Link 
                to="/login" 
                className="bg-orange-600 text-black px-8 py-4 rounded-lg text-xl hover:bg-orange-500 transition duration-300 animate-pulse"
                onClick={handleHalloweenClick}
                aria-label="Comienza tu noche de terror y registrate"
              >
                Comienza tu noche de terror
              </Link>
            </div>
          </div>
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
          {/* Efecto de Halloween al hacer clic */}
          {showHalloweenEffects && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(50)].map((_, i) => (
                <div 
                  key={i} 
                  className="absolute animate-halloween-creature"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    fontSize: `${Math.random() * 50 + 20}px`,
                    animationDuration: `${1 + Math.random() * 2}s`
                  }}
                >
                  {halloweenCreatures[Math.floor(Math.random() * halloweenCreatures.length)]}
                </div>
              ))}
            </div>
          )}
        </div>
        <section className="container mx-auto py-16 px-4">
          <h3 className="text-3xl font-bold text-orange-500 mb-8 text-center">¿Por qué elegir PeliSoft Halloween?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Selección Espeluznante", description: "Miles de películas de terror a tu disposición" },
              { title: "Calidad Escalofriante", description: "Disfruta de tus pesadillas favoritas en alta definición" },
              { title: "Sin Interrupciones", description: "Experiencia de terror ininterrumpida, sin cortes publicitarios" }
            ].map((feature, index) => (
              <div key={index} className="bg-orange-900 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
                <h4 className="text-xl font-semibold text-orange-400 mb-3">{feature.title}</h4>
                <p className="text-orange-200">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="bg-orange-600 text-black py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 PeliSoft Halloween. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

