
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
  children: JSX.Element;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>; // Puedes reemplazar con un spinner u otro indicador de carga
  }

  return user ? children : <Navigate to="/login" replace />;
};
