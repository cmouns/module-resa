import { Shield } from 'lucide-react';
import type { OptionSupp } from '../../types/database';

/**
 * Propriétés du sélecteur d'options.
 * Il reçoit les données et remonte les clics (onToggle) à son parent.
 */
interface Props {
  options: OptionSupp[];
  selectedOptions: number[];
  onToggle: (id: number) => void;
}

/**
 * Affiche la liste des options supplémentaires (GPS, Siège bébé, etc.).
 */
export default function OptionsSelector({ options, selectedOptions, onToggle }: Props) {
  return (
    <fieldset className="pt-8 border-t border-gray-100">
      <legend className="text-xl font-serif text-gray-900 mb-6 flex items-center w-full">
        <Shield className="h-5 w-5 mr-2 text-blue-500" aria-hidden="true" /> Options & Services
      </legend>
      <div className="space-y-4">
        {options.map((option) => {
          const isSelected = selectedOptions.includes(option.id);
          const checkboxId = `option-${option.id}`;
          
          return (
            <div 
              key={option.id}
              className={`flex items-center justify-between p-5 rounded-xl border transition-all duration-300 group ${isSelected ? 'border-blue-500 bg-white shadow-md ring-1 ring-blue-500' : 'border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm'}`}
            >
              <div className="flex items-center flex-1">
                <input
                  type="checkbox"
                  id={checkboxId}
                  checked={isSelected}
                  onChange={() => onToggle(option.id)}
                  className="sr-only" 
                  aria-labelledby={`label-${checkboxId}`}
                />
                <label 
                  id={`label-${checkboxId}`}
                  htmlFor={checkboxId}
                  className="font-bold text-gray-900 group-hover:text-blue-500 transition-colors cursor-pointer w-full"
                >
                  {option.libelle}
                </label>
              </div>
              
              <div className="flex items-center gap-6" aria-hidden="true">
                <div className="text-right">
                   <span className="block font-bold text-blue-500 text-lg">{option.prix_unitaire}€</span>
                   <span className="text-xs text-gray-400">/ jour</span>
                </div>
                <div className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 relative cursor-pointer ${isSelected ? 'bg-blue-500' : 'bg-gray-200'}`} onClick={() => onToggle(option.id)}>
                  <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform duration-300 absolute top-1 ${isSelected ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}