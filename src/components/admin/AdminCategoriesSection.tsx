import { useState, useEffect } from 'react';
import { Tags, Plus, Edit, Trash2 } from 'lucide-react';
import { categorieService } from '../../services/categorieService';
import type { Categorie } from '../../types/database';
import CategorieFormModal from './CategorieFormModal';

/**
 * Section d'administration permettant la gestion des catégories de véhicules.
 */
export default function AdminCategoriesSection() {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(true);
  
  // États de contrôle pour la modale d'édition/création
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categorieToEdit, setCategorieToEdit] = useState<Categorie | null>(null);

  /**
   * Charge la liste complète des catégories depuis Supabase.
   */
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categorieService.getCategories();
      setCategories(data || []);
    } catch (error) {
      console.error("Erreur de récupération des catégories :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /**
   * Tente de supprimer une catégorie de la base de données.
   */
  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
      try {
        await categorieService.deleteCategorie(id);
        setCategories(prev => prev.filter(c => c.id !== id));
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        // Message d'erreur personnalisé basé sur les contraintes relationnelles de la BDD
        alert("Impossible de supprimer cette catégorie. Elle est probablement liée à un ou plusieurs véhicules actifs.");
      }
    }
  };

  return (
    <section className="mb-12" aria-labelledby="admin-categories-title">
      <div className="flex justify-between items-center mb-6">
        <h2 id="admin-categories-title" className="text-2xl font-bold text-gray-900 flex items-center">
          <Tags className="mr-3 h-6 w-6 text-blue-600" aria-hidden="true" />
          Gestion des Catégories
        </h2>
        {/* Bouton d'ajout, ouvre la modale avec un state nul pour forcer le mode "Création" */}
        <button 
          onClick={() => { setCategorieToEdit(null); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" aria-hidden="true" />
          Nouvelle Catégorie
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        {loading ? (
          <div className="p-8 text-center text-gray-500" aria-live="polite">Chargement...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Libellé</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.length === 0 ? (
                  <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">Aucune catégorie trouvée.</td></tr>
                ) : (
                  categories.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{c.libelle}</div></td>
                      <td className="px-6 py-4"><div className="text-sm text-gray-500 line-clamp-1">{c.description || '-'}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {/* Bouton de modification */}
                        <button 
                          onClick={() => { setCategorieToEdit(c); setIsModalOpen(true); }} 
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          aria-label={`Modifier la catégorie ${c.libelle}`}
                        >
                          <Edit className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <button 
                          onClick={() => handleDelete(c.id)} 
                          className="text-red-600 hover:text-red-900"
                          aria-label={`Supprimer la catégorie ${c.libelle}`}
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

      <CategorieFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchCategories}
        categorieToEdit={categorieToEdit}
      />
    </section>
  );
}