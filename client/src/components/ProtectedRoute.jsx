import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from './Loaders';

// Blocks the dashboard for logged-out users
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <PageLoader text="Checking your session..." />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}
