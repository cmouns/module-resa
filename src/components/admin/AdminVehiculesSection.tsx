import { useState, useEffect } from 'react';
import { Car, Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { vehiculeService } from '../../services/vehiculesService';
import { categorieService } from '../../services/categorieService';
import type { Vehicule, Categorie } from '../../types/database';
import VehiculeFormModal from './VehiculeFormModal';

export default function AdminVehiculesSection() {
  const [vehicules, setVehicules] = useState<Vehicule[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehiculeToEdit, setVehiculeToEdit] = useState<Vehicule | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('all');
  const [sortPrix, setSortPrix] = useState('none');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [vehiculesData, categoriesData] = await Promise.all([
        vehiculeService.getVehicules(),
        categorieService.getCategories()
      ]);
      setVehicules(vehiculesData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce véhicule ?")) {
      try {
        await vehiculeService.deleteVehicule(id);
        setVehicules(prev => prev.filter(v => v.id !== id));
      } catch (error) {
        console.error(error);
        alert("Erreur lors de la suppression du véhicule.");
      }
    }
  };

  const filteredVehicules = vehicules
    .filter(v => {
      const searchString = `${v.marque} ${v.modele} ${v.immatriculation}`.toLowerCase();
      const matchesSearch = searchString.includes(searchTerm.toLowerCase());
      const matchesStatut = filterStatut === 'all' || v.statut === filterStatut;
      return matchesSearch && matchesStatut;
    })
    .sort((a, b) => {
      if (sortPrix === 'asc') return a.prix_jour - b.prix_jour;
      if (sortPrix === 'desc') return b.prix_jour - a.prix_jour;
      return 0;
    });

  return (
    <section className="mb-12" aria-labelledby="admin-vehicules-title">
      <div className="flex justify-between items-center mb-6">
        <h2 id="admin-vehicules-title" className="text-2xl font-bold text-gray-900 flex items-center">
          <Car className="mr-3 h-6 w-6 text-blue-600" aria-hidden="true" />
          Gestion des Véhicules
        </h2>
        <button
          onClick={() => { setVehiculeToEdit(null); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" aria-hidden="true" />
          Nouveau Véhicule
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            aria-label="Rechercher un véhicule"
            placeholder="Rechercher (marque, modèle, immat...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        
        <div className="sm:w-48 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <select
            aria-label="Filtrer par statut"
            value={filterStatut}
            onChange={(e) => setFilterStatut(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="all">Tous les statuts</option>
            <option value="disponible">Disponible</option>
            <option value="loue">Loué</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        <div className="sm:w-48 relative">
          <select
            aria-label="Trier par prix"
            value={sortPrix}
            onChange={(e) => setSortPrix(e.target.value)}
            className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="none">Trier par prix</option>
            <option value="asc">Prix croissant</option>
            <option value="desc">Prix décroissant</option>
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Véhicule</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Immat.</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix/Jour</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVehicules.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Aucun véhicule ne correspond.</td></tr>
                ) : (
                  filteredVehicules.map((v) => (
                    <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{v.marque} {v.modele}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{v.immatriculation}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{v.categorie?.libelle || '-'}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{v.prix_jour} €</div></td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${v.statut === 'disponible' ? 'bg-green-100 text-green-800' : v.statut === 'loue' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                          {v.statut}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => { setVehiculeToEdit(v); setIsModalOpen(true); }} 
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          aria-label={`Modifier le véhicule ${v.marque} ${v.modele}`}
                        >
                          <Edit className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <button 
                          onClick={() => handleDelete(v.id)} 
                          className="text-red-600 hover:text-red-900"
                          aria-label={`Supprimer le véhicule ${v.marque} ${v.modele}`}
                        >
                          <Trash2 className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <VehiculeFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
        categories={categories}
        vehiculeToEdit={vehiculeToEdit}
      />
    </section>
  );
}