// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged,signOut  } from 'firebase/auth';

interface AuthContextType {
  user: any; // Cambia el tipo según tu modelo de usuario
  loading: boolean;
  logout: () => Promise<void>; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  const logout = async () => {
    await signOut(auth);
    setUser(null); // Limpia el estado del usuario
  };

  return (
    <AuthContext.Provider value={{ user, loading ,logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
