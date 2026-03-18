import { useState, useEffect } from 'react';
import { CalendarDays, CheckCircle, XCircle, Clock, Search, Filter } from 'lucide-react';
import { reservationService } from '../../services/reservationService';

interface ProfilInfo {
  nom: string;
  prenom: string;
  email: string;
}

interface VehiculeInfo {
  marque: string;
  modele: string;
  immatriculation: string;
}

interface AdminReservation {
  id: number;
  id_vehicule: number;
  date_debut: string;
  date_fin: string;
  statut: 'attente' | 'validee' | 'terminee' | 'annulee';
  prix_total: number;
  profils: ProfilInfo | ProfilInfo[];
  vehicules: VehiculeInfo | VehiculeInfo[];
}

/**
 * Section d'administration dédiée au suivi et à la gestion des réservations.
 * Gère le cycle de vie complet d'une réservation : Attente -> Validation -> Terminée (ou Annulée).
 */
export default function AdminReservationsSection() {
  const [reservations, setReservations] = useState<AdminReservation[]>([]);
  const [loading, setLoading] = useState(true);
  
  // États pour la barre de recherche et le filtrage rapide
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('all');

  /**
   * Récupère l'historique complet de toutes les réservations du système.
   */
  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await reservationService.getAllReservations();
      setReservations(data as AdminReservation[]);
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  /**
   * Fait avancer le statut d'une réservation dans son cycle de vie.
   * @param idResa L'ID de la réservation.
   * @param idVehicule L'ID du véhicule.
   * @param newStatut Le nouveau statut à appliquer.
   */
  const handleStatutChange = async (idResa: number, idVehicule: number, newStatut: 'attente' | 'validee' | 'terminee' | 'annulee') => {
    if (window.confirm(`Confirmez-vous le passage au statut "${newStatut}" ?`)) {
      try {
        await reservationService.updateReservationStatut(idResa, idVehicule, newStatut);
        fetchReservations(); // Rafraîchissement complet pour afficher le nouveau statut
      } catch (error) {
        console.error("Erreur de mise à jour du statut :", error);
        alert("Erreur lors de la mise à jour en base de données.");
      }
    }
  };

  /**
   * Filtrage multi-critères.
   * Concatène de multiples champs pour permettre une recherche globale très fluide.
   */
  const filteredReservations = reservations.filter(resa => {
    const client = Array.isArray(resa.profils) ? resa.profils[0] : resa.profils;
    const vehicule = Array.isArray(resa.vehicules) ? resa.vehicules[0] : resa.vehicules;

    const searchString = `${resa.id} ${client?.nom} ${client?.prenom} ${client?.email} ${vehicule?.marque} ${vehicule?.modele} ${vehicule?.immatriculation}`.toLowerCase();
    
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    const matchesStatut = filterStatut === 'all' || resa.statut === filterStatut;
    
    return matchesSearch && matchesStatut;
  });

  return (
    <section className="mb-12" aria-labelledby="admin-reservations-title">
      <div className="flex justify-between items-center mb-6">
        <h2 id="admin-reservations-title" className="text-2xl font-bold text-gray-900 flex items-center">
          <CalendarDays className="mr-3 h-6 w-6 text-indigo-600" aria-hidden="true" />
          Gestion des Réservations
        </h2>
      </div>

      {/* Barre d'outils de recherche */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            aria-label="Rechercher une réservation"
            placeholder="Rechercher (ID, nom, email, plaque...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        
        <div className="sm:w-48 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <select
            aria-label="Filtrer par statut de réservation"
            value={filterStatut}
            onChange={(e) => setFilterStatut(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="all">Tous les statuts</option>
            <option value="attente">En attente</option>
            <option value="validee">Validée</option>
            <option value="terminee">Terminée</option>
            <option value="annulee">Annulée</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        {loading ? (
          <div className="p-8 text-center text-gray-500" aria-live="polite">Chargement...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Véhicule</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReservations.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Aucune réservation trouvée.</td></tr>
                ) : (
                  filteredReservations.map((resa) => {
                    const client = Array.isArray(resa.profils) ? resa.profils[0] : resa.profils;
                    const vehicule = Array.isArray(resa.vehicules) ? resa.vehicules[0] : resa.vehicules;

                    return (
                      <tr key={resa.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-bold text-indigo-600">#{resa.id}</div></td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{client?.prenom} {client?.nom}</div>
                          <div className="text-xs text-gray-500">{client?.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{vehicule?.marque} {vehicule?.modele}</div>
                          <div className="text-xs text-gray-500">{vehicule?.immatriculation}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{new Date(resa.date_debut).toLocaleDateString('fr-FR')}</div>
                          <div className="text-xs text-gray-500">au {new Date(resa.date_fin).toLocaleDateString('fr-FR')}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 text-xs leading-5 font-semibold rounded-full flex items-center gap-1 w-max ${
                            resa.statut === 'attente' ? 'bg-yellow-100 text-yellow-800' :
                            resa.statut === 'validee' ? 'bg-green-100 text-green-800' :
                            resa.statut === 'terminee' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {resa.statut === 'attente' && <Clock size={12} aria-hidden="true" />}
                            {resa.statut === 'validee' && <CheckCircle size={12} aria-hidden="true" />}
                            {resa.statut === 'annulee' && <XCircle size={12} aria-hidden="true" />}
                            {resa.statut}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {/* On ne peut valider/refuser qu'une réservation "en attente" */}
                          {resa.statut === 'attente' && (
                            <div className="flex justify-end gap-3">
                              <button onClick={() => handleStatutChange(resa.id, resa.id_vehicule, 'validee')} className="text-green-600 hover:text-green-900" aria-label={`Valider la réservation ${resa.id}`}>
                                <CheckCircle className="h-6 w-6" aria-hidden="true" />
                              </button>
                              <button onClick={() => handleStatutChange(resa.id, resa.id_vehicule, 'annulee')} className="text-red-600 hover:text-red-900" aria-label={`Refuser la réservation ${resa.id}`}>
                                <XCircle className="h-6 w-6" aria-hidden="true" />
                              </button>
                            </div>
                          )}
                          {/* On ne peut terminer qu'une réservation "validée" */}
                          {resa.statut === 'validee' && (
                            <button 
                              onClick={() => handleStatutChange(resa.id, resa.id_vehicule, 'terminee')} 
                              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors text-xs font-bold uppercase tracking-widest shadow-sm"
                              aria-label={`Marquer la réservation ${resa.id} comme terminée`}
                            >
                              Terminer
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}