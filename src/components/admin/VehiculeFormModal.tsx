import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { vehiculeService } from '../../services/vehiculesService';
import type { Categorie, Vehicule, StatutVehicule } from '../../types/database';

/**
 * Propriétés de la modale de gestion des véhicules.
 */
interface Props {
  isOpen: boolean; // Gère l'affichage de la modale
  onClose: () => void; // Fonction pour fermer la modale
  onSuccess: () => void; // Fonction pour rafraîchir la liste parente après le succès de l'action
  categories: Categorie[]; // Liste des catégories pour le menu déroulant
  vehiculeToEdit?: Vehicule | null; // Si présent, la modale passe en mode "Édition"
}

/**
 * Modale contenant le formulaire d'ajout ou de modification d'un véhicule.
 */
export default function VehiculeFormModal({ isOpen, onClose, onSuccess, categories, vehiculeToEdit }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    marque: '',
    modele: '',
    immatriculation: '',
    prix_jour: '',
    statut: 'disponible' as StatutVehicule,
    id_categorie: '',
    image_url: ''
  });

  /**
   * Effet déclenché à l'ouverture de la modale ou au changement du véhicule à éditer.
   * Pré-remplit le formulaire si on est en mode Édition sinon le réinitialise à zéro.
   */
  useEffect(() => {
    if (vehiculeToEdit) {
      setFormData({
        marque: vehiculeToEdit.marque,
        modele: vehiculeToEdit.modele,
        immatriculation: vehiculeToEdit.immatriculation,
        prix_jour: vehiculeToEdit.prix_jour.toString(),
        statut: vehiculeToEdit.statut,
        id_categorie: vehiculeToEdit.id_categorie.toString(),
        image_url: vehiculeToEdit.image_url || ''
      });
    } else {
      // Reset complet pour une nouvelle création
      setFormData({ marque: '', modele: '', immatriculation: '', prix_jour: '', statut: 'disponible', id_categorie: '', image_url: '' });
    }
  }, [vehiculeToEdit, isOpen]);

  /**
   * Gestionnaire d'événement générique pour tous les champs de saisie input et select.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Valide le formulaire et envoie les données à Supabase.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Formatage des données pour correspondre aux types stricts de la base de données
      const payload = {
        marque: formData.marque,
        modele: formData.modele,
        immatriculation: formData.immatriculation,
        prix_jour: parseFloat(formData.prix_jour),
        statut: formData.statut as StatutVehicule,
        id_categorie: parseInt(formData.id_categorie),
        image_url: formData.image_url || undefined
      };

      if (vehiculeToEdit) {
        await vehiculeService.updateVehicule(vehiculeToEdit.id, payload);
      } else {
        await vehiculeService.createVehicule(payload);
      }
      
      // Si succes, ça avertit le composant parent et on ferme la modale
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire :", error);
      alert("Erreur lors de l'enregistrement du véhicule.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 px-4 py-8 overflow-y-auto"
      // Permet de fermer la modale en cliquant sur l'arrière-plan
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl p-6 my-auto"
        // Empêche le clic sur la modale elle-même de déclencher la fermeture
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <h3 id="modal-title" className="text-lg font-bold text-gray-900">
            {/* Rendu conditionnel du titre selon le mode */}
            {vehiculeToEdit ? 'Modifier le véhicule' : 'Ajouter un véhicule'}
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-900 transition-colors"
            aria-label="Fermer la fenêtre"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="marque" className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
              <input id="marque" type="text" name="marque" required value={formData.marque} onChange={handleInputChange} className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="modele" className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
              <input id="modele" type="text" name="modele" required value={formData.modele} onChange={handleInputChange} className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="immatriculation" className="block text-sm font-medium text-gray-700 mb-1">Immatriculation</label>
              <input id="immatriculation" type="text" name="immatriculation" required value={formData.immatriculation} onChange={handleInputChange} className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="prix_jour" className="block text-sm font-medium text-gray-700 mb-1">Prix / Jour (€)</label>
              <input id="prix_jour" type="number" step="0.01" min="0" name="prix_jour" required value={formData.prix_jour} onChange={handleInputChange} className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
          </div>
          
          <div>
            <label htmlFor="id_categorie" className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <select id="id_categorie" name="id_categorie" required value={formData.id_categorie} onChange={handleInputChange} className="block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <option value="" disabled>Sélectionner une catégorie</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.libelle}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="statut" className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select id="statut" name="statut" required value={formData.statut} onChange={handleInputChange} className="block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <option value="disponible">Disponible</option>
              <option value="loue">Loué</option>
              <option value="maintenance">En maintenance</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">URL de l'image (Optionnel)</label>
            <input id="image_url" type="url" name="image_url" value={formData.image_url} onChange={handleInputChange} placeholder="https://..." className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          </div>
          
          <div className="pt-4">
            <button type="submit" disabled={isSubmitting || categories.length === 0} className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 transition-colors">
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer le véhicule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}