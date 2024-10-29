import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { loginWithEmail } from '../services/authService';
import { loginWithGoogle } from '../services/authService';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  //para redirirgir 
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
      await loginWithEmail(formData.email, formData.password);
      navigate('/dashboard'); // Redirige al dashboard después de un inicio de sesión exitoso
    } catch (err) {
      setError('Error al iniciar sesión: ');
    }
  };
  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/dashboard'); // Redirige al dashboard tras un inicio de sesión exitoso
    } catch (err) {
      setError('Error al iniciar sesión con Google'+ (err as Error).message);
    }
  };
  

  return (
    <div className="min-h-screen bg-black flex items-center justify-center bg-[url('/haunted-house.jpg')] bg-cover bg-center relative overflow-hidden">
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
        <h2 className="text-3xl font-bold text-orange-500 mb-6 text-center">Invoca tu Pesadilla</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>} {/* Mensaje de error */}
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
            Entrar al Infierno
          </button>
         
        </form>
        <br />
          {/*aqui puedo hacer para iniciar con gogle*/}
          
          <button 
              type="button" 
              onClick={handleGoogleLogin} 
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-300 font-bold"
            >
              Iniciar sesión con Google
            </button>
         
        <p className="mt-4 text-center text-orange-300">
          ¿Aún no has vendido tu alma? <Link to="/register" className="text-orange-500 hover:underline">Regístrate aquí</Link>
        </p>
        <div className="mt-6 text-center">
          <span className="inline-block animate-pulse text-4xl">💀</span>
        </div>
      </div>
    </div>
  );
}