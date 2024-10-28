import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerWithEmail } from '../services/authService';
import '../styles/index.css'

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  //redirigir despues del registro
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      await registerWithEmail(formData.email, formData.password);
      navigate('/dashboard'); // Redirige al dashboard después de un registro exitoso
    } catch (err) {
      setError('Error al registrar:'+ (err as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center bg-[url('/spooky-background.jpg')] bg-cover bg-center relative overflow-hidden">
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

      <div className="bg-orange-900 p-8 rounded-lg shadow-2xl w-96 border-2 border-orange-500 relative z-10">
        <h2 className="text-3xl font-bold text-orange-500 mb-6 text-center">Únete al Terror</h2>
        {error && <p className="text-red-500">{error}</p>} {/* Mensaje de error */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-orange-300 mb-2">Nombre de la Víctima</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-black text-orange-500 border border-orange-500 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-orange-300 mb-2">Correo Maldito</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-black text-orange-500 border border-orange-500 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-orange-300 mb-2">Contraseña Oscura</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-black text-orange-500 border border-orange-500 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600"
              required
            />
          </div>
          <button type="submit" className="w-full bg-orange-600 text-black py-2 rounded-md hover:bg-orange-500 transition duration-300 font-bold">
            Sellar tu Destino
          </button>
        </form>
        <p className="mt-4 text-center text-orange-300">
          ¿Ya vendiste tu alma? <Link to="/login" className="text-orange-500 hover:underline">Inicia tu pesadilla</Link>
        </p>
        <div className="mt-6 text-center">
          <span className="inline-block animate-bounce text-4xl">🎃</span>
        </div>
      </div>
    </div>
  );
}