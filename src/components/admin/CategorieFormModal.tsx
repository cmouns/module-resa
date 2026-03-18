import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { categorieService } from '../../services/categorieService';
import type { Categorie } from '../../types/database';

/**
 * Propriétés de la modale de gestion des catégories.
 */
interface Props {
  isOpen: boolean; // Contrôle l'affichage de la modale depuis le composant parent
  onClose: () => void; // Fonction de fermeture
  onSuccess: () => void; // Fonction de rafraîchissement déclenchée après un appel API réussi
  categorieToEdit?: Categorie | null; // Les données de la catégorie si on est en mode édition
}

/**
 * Modale contenant le formulaire pour les catégories de véhicules.
 */
export default function CategorieFormModal({ isOpen, onClose, onSuccess, categorieToEdit }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    libelle: '',
    description: ''
  });

  /**
   * Synchronisation de l'état du formulaire avec la propriété "categorieToEdit".
   * S'exécute à chaque fois que la modale s'ouvre ou que la catégorie ciblée change.
   */
  useEffect(() => {
    if (categorieToEdit) {
      setFormData({
        libelle: categorieToEdit.libelle,
        description: categorieToEdit.description || '' // Gestion des valeurs nulles de la BDD
      });
    } else {
      // Remise à zéro propre pour le mode création
      setFormData({ libelle: '', description: '' });
    }
  }, [categorieToEdit, isOpen]);

  /**
   * Fonction de mise à jour des champs du formulaire.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Intercepte la soumission et formate les données.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Préparation de l'objet à envoyer à Supabase
      // Si la description est vide, on envoie undefined pour éviter d'insérer des chaînes vides
      const payload = {
        libelle: formData.libelle,
        description: formData.description || undefined
      };

      if (categorieToEdit) {
        await categorieService.updateCategorie(categorieToEdit.id, payload);
      } else {
        await categorieService.createCategorie(payload);
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la soumission de la catégorie :", error);
      alert("Erreur lors de l'enregistrement de la catégorie.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 px-4 py-8 overflow-y-auto"
      onClick={onClose} // Fermeture en cliquant sur l'arrière-plan
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-categorie-title"
    >
      <div 
        className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-6 my-auto"
        onClick={(e) => e.stopPropagation()} // Bloque la propagation du clic pour ne pas fermer la modale
      >
        <div className="flex justify-between items-center mb-5">
          <h3 id="modal-categorie-title" className="text-lg font-bold text-gray-900">
            {categorieToEdit ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors" aria-label="Fermer la fenêtre">
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="libelle" className="block text-sm font-medium text-gray-700 mb-1">Libellé</label>
            <input 
              id="libelle" 
              type="text" 
              name="libelle" 
              required 
              value={formData.libelle} 
              onChange={handleInputChange} 
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description (Optionnelle)</label>
            <textarea 
              id="description" 
              name="description" 
              rows={3} 
              value={formData.description} 
              onChange={handleInputChange} 
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
            />
          </div>
          
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 transition-colors"
            >
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer la catégorie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}