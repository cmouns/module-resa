import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ShieldAlert } from 'lucide-react';
import AdminCategoriesSection from '../../components/admin/AdminCategoriesSection';
import AdminVehiculesSection from '../../components/admin/AdminVehiculesSection';
import AdminOptionsSection from '../../components/admin/AdminOptionsSection';
import AdminReservationsSection from '../../components/admin/AdminReservationsSection';

/**
 * Interface d'administration centrale.
 * Regroupe la gestion du catalogue (véhicules, catégories, options) et le suivi des réservations.
 */
export default function DashboardAdmin() {
  const { profil, loading: authLoading } = useAuth();

  // Affichage d'un état d'attente pendant la vérification de la session
  if (authLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50" aria-busy="true">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </main>
    );
  }

  /**
   * Vérification du rôle administrateur.
   * Si l'utilisateur n'est pas identifié ou n'a pas les droits requis, l'accès est bloqué.
   */
  if (!profil || profil.role !== 'admin') {
    return (
      <main className="max-w-7xl mx-auto px-4 py-24 text-center">
        <ShieldAlert className="h-16 w-16 text-red-500 mx-auto mb-4" aria-hidden="true" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Accès Refusé</h1>
        <p className="text-lg text-gray-600 mb-8">Espace réservé au personnel autorisé uniquement.</p>
        <Link to="/" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
          Retour à l'accueil
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <AdminReservationsSection />
      <AdminCategoriesSection />
      <AdminVehiculesSection />
      <AdminOptionsSection />
    </main>
  );
}