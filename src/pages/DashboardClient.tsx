import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { reservationService } from '../services/reservationService';
import { Car, ArrowRight } from 'lucide-react';
import ReservationCard, { type ReservationDetails, type OptionSupp } from '../components/client/ReservationCard';

export default function DashboardClient() {
  const { user, profil } = useAuth();
  
  const [reservations, setReservations] = useState<ReservationDetails[]>([]);
  const [optionsDispos, setOptionsDispos] = useState<OptionSupp[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInitialData = useCallback(async () => {
    try {
      if (!user?.id) return;
      const [resData, optData] = await Promise.all([
        reservationService.getUserReservations(user.id),
        reservationService.getOptions()
      ]);
      setReservations(resData as ReservationDetails[]);
      setOptionsDispos(optData as OptionSupp[]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F5]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F9F5] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-serif font-extrabold text-gray-900 mb-2">Mon Espace Client</h1>
          <p className="text-gray-500">Bienvenue {profil?.prenom}, voici l'historique de vos réservations.</p>
        </div>

        {reservations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <Car className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune réservation</h3>
            <p className="text-gray-500 mb-6">Vous n'avez pas encore réservé de véhicule avec nous.</p>
            <Link 
              to="/" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-widest rounded-lg transition-colors"
            >
              Voir le catalogue <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {reservations.map((resa) => (
              <ReservationCard 
                key={resa.id} 
                reservation={resa} 
                optionsDispos={optionsDispos} 
                onRefresh={fetchInitialData} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}