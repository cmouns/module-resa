import { CalendarDays, ChevronRight } from 'lucide-react';
import type { Vehicule } from '../../types/database';

interface Props {
  vehicule: Vehicule;
  dateDebut: string;
  dateFin: string;
  setDateDebut: (d: string) => void;
  setDateFin: (d: string) => void;
  erreurDates: string;
  prixTotal: number;
  selectedOptionsCount: number;
  onReserve: () => void;
  isSubmitting: boolean;
  isLoggedIn: boolean;
}

export default function ReservationSidebar({ vehicule, dateDebut, dateFin, setDateDebut, setDateFin, erreurDates, prixTotal, selectedOptionsCount, onReserve, isSubmitting, isLoggedIn }: Props) {
  return (
    <>
      <aside className="lg:w-2/5" aria-labelledby="sidebar-title">
        <div className="bg-[#121212] rounded-2xl shadow-2xl text-white p-6 sticky top-24">
          <h2 id="sidebar-title" className="font-serif text-xl text-white mb-6 border-b border-white/10 pb-4">
            Votre Voyage
          </h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="date_debut" className="text-xs uppercase tracking-widest text-gray-500 font-bold">Départ</label>
              <div className="relative group">
                 <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={16} aria-hidden="true" />
                 <input 
                  id="date_debut"
                  type="date" 
                  min={new Date().toISOString().split('T')[0]}
                  value={dateDebut}
                  onChange={(e) => setDateDebut(e.target.value)}
                  onClick={(e) => { if (typeof e.currentTarget.showPicker === 'function') e.currentTarget.showPicker(); }}
                  className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all scheme-dark cursor-pointer"
                 />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="date_fin" className="text-xs uppercase tracking-widest text-gray-500 font-bold">Retour</label>
              <div className="relative group">
                 <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={16} aria-hidden="true" />
                 <input 
                  id="date_fin"
                  type="date" 
                  min={dateDebut || new Date().toISOString().split('T')[0]}
                  value={dateFin}
                  onChange={(e) => setDateFin(e.target.value)}
                  onClick={(e) => { if (typeof e.currentTarget.showPicker === 'function') e.currentTarget.showPicker(); }}
                  className="w-full bg-[#1A1A1A] border border-gray-800 rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all scheme-dark cursor-pointer"
                 />
              </div>
            </div>

            {erreurDates && (
              <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm" role="alert">
                {erreurDates}
              </div>
            )}

            <div className="border-t border-white/10 pt-6 mt-6">
              <div className="flex justify-between text-sm mb-3">
                <span className="text-gray-400">Prix Véhicule</span>
                <span>{vehicule.prix_jour}€ / j</span>
              </div>
              {selectedOptionsCount > 0 && (
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-gray-400">Options ({selectedOptionsCount})</span>
                  <span className="text-blue-500">Actives</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      <div className={`fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 md:p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex items-center justify-between z-40 transition-transform duration-500 ${dateDebut && dateFin ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-4 lg:px-8">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Total Estimé</p>
            <div className="flex items-baseline gap-1">
               <p className="text-3xl font-serif font-bold text-gray-900">{prixTotal.toLocaleString()}€</p>
               <span className="text-xs text-gray-400 font-bold">TTC</span>
            </div>
          </div>
          
          <button 
            onClick={onReserve}
            disabled={prixTotal === 0 || !!erreurDates || isSubmitting}
            aria-busy={isSubmitting}
            className="bg-[#121212] hover:bg-blue-500 disabled:bg-gray-300 disabled:hover:text-white disabled:shadow-none hover:text-black text-white px-8 py-4 rounded-lg font-bold uppercase tracking-widest transition-all hover:shadow-[0_4px_20px_rgba(212,175,55,0.4)] flex items-center gap-2"
          >
            {isSubmitting ? 'Traitement...' : (!isLoggedIn ? 'Se connecter' : 'Confirmer')}
            {!isSubmitting && <ChevronRight size={16} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </>
  );
}