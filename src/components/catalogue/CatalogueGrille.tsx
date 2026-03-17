import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { vehiculeService } from '../../services/vehiculesService';
import type { Vehicule } from '../../types/database';
import { Search, Car, Tag, Euro, CalendarDays } from 'lucide-react';

export default function CatalogueGrille() {
  const [vehicules, setVehicules] = useState<Vehicule[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');

  useEffect(() => {
    const fetchVehicules = async () => {
      try {
        const data = await vehiculeService.getVehicules();
        const vehiculesDispos = (data || []).filter(v => v.statut === 'disponible');
        setVehicules(vehiculesDispos);
      } catch (error) {
        console.error(error);
        setVehicules([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicules();
  }, []);

  const vehiculesFiltres = vehicules.filter(v => 
    `${v.marque} ${v.modele}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section aria-labelledby="catalogue-title">
      <div className="bg-white rounded-xl shadow-lg p-2 mb-12 border border-gray-100 max-w-4xl mx-auto flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
        
        <div className="flex-1 flex items-center w-full p-2">
          <label htmlFor="search-vehicule" className="sr-only">Rechercher une marque ou un modèle</label>
          <Search className="h-5 w-5 text-blue-400 ml-2 mr-3" aria-hidden="true" />
          <input 
            id="search-vehicule"
            type="text" 
            placeholder="Marque, modèle..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-400 outline-none"
          />
        </div>

        <div className="flex-1 flex items-center w-full p-2">
          <CalendarDays className="h-5 w-5 text-blue-400 ml-2 mr-3" aria-hidden="true" />
          <div className="flex flex-col w-full">
            <label htmlFor="filter-date-debut" className="text-xs text-gray-400 font-medium mb-1">Départ</label>
            <input 
              id="filter-date-debut"
              type="date" 
              min={new Date().toISOString().split('T')[0]}
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              onClick={(e) => {
                if (typeof e.currentTarget.showPicker === 'function') {
                  e.currentTarget.showPicker();
                }
              }}
              className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-900 text-sm cursor-pointer outline-none"
            />
          </div>
        </div>

        <div className="flex-1 flex items-center w-full p-2">
          <CalendarDays className="h-5 w-5 text-blue-400 ml-2 mr-3" aria-hidden="true" />
          <div className="flex flex-col w-full">
            <label htmlFor="filter-date-fin" className="text-xs text-gray-400 font-medium mb-1">Retour</label>
            <input 
              id="filter-date-fin"
              type="date" 
              min={dateDebut || new Date().toISOString().split('T')[0]}
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
              onClick={(e) => {
                if (typeof e.currentTarget.showPicker === 'function') {
                  e.currentTarget.showPicker();
                }
              }}
              className="w-full bg-transparent border-none p-0 focus:ring-0 text-gray-900 text-sm cursor-pointer outline-none"
            />
          </div>
        </div>
      </div>

      <header className="mb-8 flex items-center justify-between">
        <h2 id="catalogue-title" className="text-2xl font-bold text-gray-900">Nos véhicules prêts à partir</h2>
        <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1.5 rounded-full shadow-sm" aria-live="polite">
          {vehiculesFiltres.length} résultat{vehiculesFiltres.length !== 1 ? 's' : ''}
        </span>
      </header>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-24" aria-busy="true">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-500 font-medium">Chargement du catalogue...</p>
        </div>
      ) : vehiculesFiltres.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-xl border border-gray-200 shadow-sm" role="alert">
          <Car className="mx-auto h-16 w-16 text-gray-300 mb-4" aria-hidden="true" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun véhicule trouvé</h3>
          {searchTerm ? (
            <p className="text-gray-500">Aucun modèle ne correspond à la recherche "{searchTerm}".</p>
          ) : (
            <p className="text-gray-500">Tous nos véhicules sont actuellement loués ou en maintenance.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehiculesFiltres.map((vehicule) => (
            <article key={vehicule.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group transform hover:-translate-y-1">
              <div className="h-56 bg-gray-100 relative overflow-hidden">
                {vehicule.image_url ? (
                  <img src={vehicule.image_url} alt={`Photo du véhicule ${vehicule.marque} ${vehicule.modele}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-300" aria-hidden="true"><Car className="h-20 w-20" /></div>
                )}
                <div className="absolute top-4 left-4 bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" aria-hidden="true"></span>
                  Disponible
                </div>
              </div>
              <div className="p-6 flex flex-col grow">
                <header className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 leading-tight">{vehicule.marque} <span className="font-light">{vehicule.modele}</span></h3>
                </header>
                <div className="flex items-center justify-between mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="flex items-center text-gray-600">
                    <Tag className="h-4 w-4 mr-2 text-blue-500" aria-hidden="true" />
                    <span className="text-sm font-medium">{vehicule.categorie?.libelle || 'Standard'}</span>
                  </div>
                  <div className="flex items-center text-gray-900 font-bold">
                    <Euro className="h-5 w-5 mr-1 text-blue-600" aria-hidden="true" />
                    <span className="text-lg">{vehicule.prix_jour}</span>
                    <span className="text-xs text-gray-500 font-normal ml-1">/ jour</span>
                  </div>
                </div>
                <div className="mt-auto">
                  <Link to={`/vehicule/${vehicule.id}`} className="w-full flex justify-center items-center bg-gray-900 text-white px-4 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors duration-300">
                    Voir les détails et réserver
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}