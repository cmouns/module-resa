import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface Props {
  children: React.ReactNode;
}

/**
 * Garde de route pour les pages admin.
 * Redirige vers l'accueil si l'utilisateur n'est pas connecté ou n'est pas admin.
 */
export default function ProtectedAdminRoute({ children }: Props) {
  const { profil, loading } = useAuth();

  // On attend que la session soit vérifiée
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" aria-busy="true">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Pas connecté ou pas admin -> redirection
  if (!profil || profil.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;

  
}

/**
 * Garde de route pour les pages clients connectés.
 */
export function ProtectedClientRoute({ children }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" aria-busy="true">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}