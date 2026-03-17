import { useState } from 'react';
import { CalendarDays, Car, Euro, Clock, CheckCircle, XCircle, Edit2, Save, X, Settings2 } from 'lucide-react';
import { reservationService } from '../../services/reservationService';

export interface VehiculeInfo {
  id: number;
  marque: string;
  modele: string;
  image_url: string | null;
  prix_jour: number;
}

export interface OptionSupp {
  id: number;
  libelle: string;
  prix_unitaire: number;
}

export interface ReservationOption {
  id_option: number;
  options_supp: { libelle: string } | { libelle: string }[] | null;
}

export interface ReservationDetails {
  id: number;
  date_debut: string;
  date_fin: string;
  statut: string;
  prix_total: number;
  vehicules: VehiculeInfo | VehiculeInfo[];
  reservation_options: ReservationOption[];
}

interface ReservationCardProps {
  reservation: ReservationDetails;
  optionsDispos: OptionSupp[];
  onRefresh: () => void;
}

export default function ReservationCard({ reservation, optionsDispos, onRefresh }: ReservationCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editDateDebut, setEditDateDebut] = useState('');
  const [editDateFin, setEditDateFin] = useState('');
  const [editSelectedOptions, setEditSelectedOptions] = useState<number[]>([]);

  const vehicule = Array.isArray(reservation.vehicules) ? reservation.vehicules[0] : reservation.vehicules;
  
  const optionsLibelles = reservation.reservation_options
    ?.map((ro) => {
      const opt = Array.isArray(ro.options_supp) ? ro.options_supp[0] : ro.options_supp;
      return opt?.libelle;
    })
    .filter(Boolean)
    .join(', ') || 'Aucune option';

  let erreurDates = '';
  let editNouveauPrix = reservation.prix_total;

  if (isEditing && editDateDebut && editDateFin) {
    const start = new Date(editDateDebut);
    const end = new Date(editDateFin);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (end < start) {
      erreurDates = 'La date de retour doit être après le départ.';
      editNouveauPrix = 0;
    } else {
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 

      const optionsPrixJournalier = editSelectedOptions.reduce((acc, optId) => {
        const option = optionsDispos.find(o => o.id === optId);
        return acc + (option ? Number(option.prix_unitaire) : 0);
      }, 0);

      editNouveauPrix = diffDays * (Number(vehicule.prix_jour) + optionsPrixJournalier);
    }
  }

  const handleAnnuler = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
      try {
        await reservationService.updateReservationStatut(reservation.id, vehicule.id, 'annulee');
        onRefresh();
      } catch (error) {
        console.error(error);
        alert("Erreur lors de l'annulation.");
      }
    }
  };

  const startEditing = () => {
    setIsEditing(true);
    setEditDateDebut(reservation.date_debut);
    setEditDateFin(reservation.date_fin);
    const currentOptIds = reservation.reservation_options.map(ro => ro.id_option);
    setEditSelectedOptions(currentOptIds);
  };

  const toggleOption = (idOpt: number) => {
    setEditSelectedOptions(prev => 
      prev.includes(idOpt) ? prev.filter(x => x !== idOpt) : [...prev, idOpt]
    );
  };

  const handleSaveEdit = async () => {
    if (erreurDates || editNouveauPrix === 0) return;

    try {
      const estDispo = await reservationService.checkDisponibiliteUpdate(vehicule.id, editDateDebut, editDateFin, reservation.id);
      
      if (!estDispo) {
        alert("Ce véhicule est indisponible sur ces nouvelles dates.");
        return;
      }

      await reservationService.updateReservationComplete(reservation.id, editDateDebut, editDateFin, editNouveauPrix, editSelectedOptions);
      
      setIsEditing(false);
      onRefresh();
      alert("Réservation modifiée avec succès !");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la modification.");
    }
  };

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row transition-all hover:shadow-md">
      <div className="md:w-64 h-48 md:h-auto bg-gray-100 relative">
        {vehicule?.image_url ? (
          <img src={vehicule.image_url} alt={`Image du véhicule ${vehicule.marque}`} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400" aria-hidden="true">
            <Car className="h-16 w-16 opacity-50" />
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1 ${
            reservation.statut === 'attente' ? 'bg-yellow-100 text-yellow-800' :
            reservation.statut === 'validee' ? 'bg-green-100 text-green-800' :
            reservation.statut === 'terminee' ? 'bg-gray-100 text-gray-800' :
            'bg-red-100 text-red-800'
          }`}>
            {reservation.statut === 'attente' && <Clock size={12} aria-hidden="true" />}
            {reservation.statut === 'validee' && <CheckCircle size={12} aria-hidden="true" />}
            {reservation.statut === 'annulee' && <XCircle size={12} aria-hidden="true" />}
            {reservation.statut}
          </span>
        </div>
      </div>

      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Réservation #{reservation.id}</p>
              <h3 className="text-2xl font-serif font-bold text-gray-900">
                {vehicule?.marque} <span className="font-light">{vehicule?.modele}</span>
              </h3>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900 flex items-center justify-end">
                {isEditing ? editNouveauPrix : reservation.prix_total} <Euro className="h-5 w-5 ml-1 text-blue-600" aria-hidden="true" />
              </p>
              <p className="text-xs text-gray-400 uppercase tracking-widest">Total TTC</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 border-t border-gray-100 pt-6">
            <div className="flex items-start text-gray-600">
              <CalendarDays className="h-5 w-5 mr-3 text-blue-500 mt-1" aria-hidden="true" />
              <div className="flex-1">
                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Période</p>
                
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <label htmlFor={`debut-${reservation.id}`} className="block text-xs text-gray-500 mb-1">Départ</label>
                      <input 
                        id={`debut-${reservation.id}`}
                        type="date" 
                        value={editDateDebut} 
                        onChange={(e) => setEditDateDebut(e.target.value)}
                        onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                        onKeyDown={(e) => e.preventDefault()}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm cursor-pointer"
                      />
                    </div>
                    <div>
                      <label htmlFor={`fin-${reservation.id}`} className="block text-xs text-gray-500 mb-1">Retour</label>
                      <input 
                        id={`fin-${reservation.id}`}
                        type="date" 
                        value={editDateFin} 
                        onChange={(e) => setEditDateFin(e.target.value)}
                        onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                        onKeyDown={(e) => e.preventDefault()}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm cursor-pointer"
                      />
                    </div>
                    {erreurDates && <p className="text-xs text-red-500 font-medium" role="alert">{erreurDates}</p>}
                  </div>
                ) : (
                  <p className="text-sm font-medium mt-1">Du {new Date(reservation.date_debut).toLocaleDateString('fr-FR')}<br/>au {new Date(reservation.date_fin).toLocaleDateString('fr-FR')}</p>
                )}
              </div>
            </div>

            <div className="flex items-start text-gray-600">
              <Settings2 className="h-5 w-5 mr-3 text-blue-500 mt-1" aria-hidden="true" />
              <div className="flex-1">
                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Options incluses</p>
                
                {isEditing ? (
                  <fieldset className="space-y-2 mt-2">
                    <legend className="sr-only">Modifier les options</legend>
                    {optionsDispos.map((opt) => (
                      <label key={opt.id} className="flex items-center text-sm cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={editSelectedOptions.includes(opt.id)}
                          onChange={() => toggleOption(opt.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                        />
                        <span className="ml-2 text-gray-700 group-hover:text-blue-600 transition-colors">
                          {opt.libelle} <span className="text-gray-400 text-xs">(+{opt.prix_unitaire}€/j)</span>
                        </span>
                      </label>
                    ))}
                  </fieldset>
                ) : (
                  <p className="text-sm font-medium mt-1">{optionsLibelles}</p>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
              <button 
                onClick={() => setIsEditing(false)} 
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex items-center"
                aria-label="Annuler les modifications"
              >
                <X size={16} className="mr-2" aria-hidden="true" /> Annuler
              </button>
              <button 
                onClick={handleSaveEdit} 
                disabled={!!erreurDates}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Enregistrer les modifications"
              >
                <Save size={16} className="mr-2" aria-hidden="true" /> Enregistrer les modifications
              </button>
            </div>
          )}

          {(reservation.statut === 'attente' || reservation.statut === 'validee') && !isEditing && (
            <div className="mt-6 border-t border-gray-100 pt-4 flex gap-6 justify-end">
              <button
                onClick={startEditing}
                className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center"
                aria-label="Modifier les dates ou les options"
              >
                <Edit2 className="h-4 w-4 mr-1.5" aria-hidden="true" />
                Modifier ma réservation
              </button>
              <button
                onClick={handleAnnuler}
                className="text-sm font-bold text-red-600 hover:text-red-800 transition-colors flex items-center"
                aria-label="Annuler définitivement la réservation"
              >
                <XCircle className="h-4 w-4 mr-1.5" aria-hidden="true" />
                Annuler
              </button>
            </div>
          )}

        </div>
      </div>
    </article>
  );
}