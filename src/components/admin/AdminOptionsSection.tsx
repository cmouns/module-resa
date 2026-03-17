import { useState, useEffect } from 'react';
import { Shield, Plus, Edit, Trash2 } from 'lucide-react';
import { optionsService } from '../../services/optionsService';
import type { OptionSupp } from '../../types/database';
import OptionFormModal from './OptionFormModal';

export default function AdminOptionsSection() {
  const [options, setOptions] = useState<OptionSupp[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [optionToEdit, setOptionToEdit] = useState<OptionSupp | null>(null);

  const fetchOptions = async () => {
    try {
      setLoading(true);
      const data = await optionsService.getOptions();
      setOptions(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette option ?")) {
      try {
        await optionsService.deleteOption(id);
        setOptions(prev => prev.filter(o => o.id !== id));
      } catch (error) {
        console.error(error);
        alert("Erreur lors de la suppression de l'option.");
      }
    }
  };

  return (
    <section className="mt-12" aria-labelledby="admin-options-title">
      <div className="flex justify-between items-center mb-6">
        <h2 id="admin-options-title" className="text-2xl font-bold text-gray-900 flex items-center">
          <Shield className="mr-3 h-6 w-6 text-blue-600" aria-hidden="true" />
          Gestion des Options & Services
        </h2>
        <button 
          onClick={() => { setOptionToEdit(null); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" aria-hidden="true" />
          Nouvelle Option
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix / Jour</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {options.length === 0 ? (
                  <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">Aucune option trouvée.</td></tr>
                ) : (
                  options.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{o.libelle}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{o.prix_unitaire} €</div></td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => { setOptionToEdit(o); setIsModalOpen(true); }} 
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          aria-label={`Modifier l'option ${o.libelle}`}
                        >
                          <Edit className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <button 
                          onClick={() => handleDelete(o.id)} 
                          className="text-red-600 hover:text-red-900"
                          aria-label={`Supprimer l'option ${o.libelle}`}
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

      <OptionFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchOptions}
        optionToEdit={optionToEdit}
      />
    </section>
  );
}