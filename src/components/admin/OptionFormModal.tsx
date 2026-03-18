import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { optionsService } from '../../services/optionsService';
import type { OptionSupp } from '../../types/database';

/**
 * Propriétés de la modale de gestion des options supplémentaires.
 */
interface Props {
  isOpen: boolean; // État de visibilité de la modale
  onClose: () => void; // Callback pour fermer la fenêtre
  onSuccess: () => void; // Callback pour rafraîchir la liste parente après validation
  optionToEdit?: OptionSupp | null; // L'objet à éditer 
}

/**
 * Modale contenant le formulaire pour les options (Siège bébé, GPS...).
 */
export default function OptionFormModal({ isOpen, onClose, onSuccess, optionToEdit }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // État local du formulaire (Controlled Component)
  const [formData, setFormData] = useState({
    libelle: '',
    prix_unitaire: ''
  });

  /**
   * Effet déclenché à l'ouverture : remplis les champs si on est en modification,
   * sinon remet le formulaire à zéro pour une création propre.
   */
  useEffect(() => {
    if (optionToEdit) {
      setFormData({
        libelle: optionToEdit.libelle,
        prix_unitaire: optionToEdit.prix_unitaire.toString() // Conversion en string pour l'input
      });
    } else {
      setFormData({ libelle: '', prix_unitaire: '' });
    }
  }, [optionToEdit, isOpen]);

  /**
   * Gestionnaire de saisie générique pour tous les inputs du formulaire.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Soumet les données au service correspondant Création ou Mise à jour.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Préparation du Payload
      const payload = {
        libelle: formData.libelle,
        prix_unitaire: parseFloat(formData.prix_unitaire) // Re-conversion en nombre
      };

      if (optionToEdit) {
        await optionsService.updateOption(optionToEdit.id, payload);
      } else {
        await optionsService.createOption(payload);
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'option :", error);
      alert("Erreur lors de l'enregistrement de l'option.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 px-4 py-8 overflow-y-auto"
      onClick={onClose} // Fermeture au clic sur le fond
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-option-title"
    >
      <div 
        className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-6 my-auto"
        onClick={(e) => e.stopPropagation()} // Empêche la fermeture au clic sur la modale
      >
        <div className="flex justify-between items-center mb-5">
          <h3 id="modal-option-title" className="text-lg font-bold text-gray-900">
            {optionToEdit ? "Modifier l'option" : "Ajouter une option"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors" aria-label="Fermer la fenêtre">
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="libelle" className="block text-sm font-medium text-gray-700 mb-1">Libellé (ex: Siège Bébé)</label>
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
            <label htmlFor="prix_unitaire" className="block text-sm font-medium text-gray-700 mb-1">Prix unitaire / Jour (€)</label>
            <input 
              id="prix_unitaire"
              type="number" 
              step="0.01" 
              min="0" 
              name="prix_unitaire" 
              required 
              value={formData.prix_unitaire} 
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
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer l\'option'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}