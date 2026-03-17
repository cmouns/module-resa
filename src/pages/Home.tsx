import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Car, CreditCard, Clock, ArrowRight } from 'lucide-react';
import { supabase } from '../services/supabase';

interface Vehicule {
  id: number;
  marque: string;
  modele: string;
  prix_jour: number;
  image_url: string | null;
  statut: string;
  categories: { libelle: string } | null;
}

export default function HomePage() {
  const [vehicules, setVehicules] = useState<Vehicule[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCatalogue = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vehicules')
        .select(`
          id, 
          marque, 
          modele, 
          prix_jour, 
          image_url, 
          statut,
          categories (libelle)
        `)
        .neq('statut', 'loue')
        .order('id', { ascending: false });

      if (error) throw error;
      setVehicules(data as unknown as Vehicule[]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogue();
  }, []);

  return (
    <main className="bg-[#F9F9F5] min-h-screen">
      <header className="bg-blue-600 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Prenez la route avec style et simplicité
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Découvrez notre sélection de véhicules haut de gamme. Réservez en trois clics et partez l'esprit tranquille.
          </p>
          <a
            href="#catalogue"
            className="inline-flex items-center px-8 py-4 border border-transparent text-base font-bold rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors"
          >
            Voir nos véhicules <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </header>

      <section aria-labelledby="rassurance-title" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-gray-200">
        <h2 id="rassurance-title" className="sr-only">Nos points forts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 p-4 rounded-full mb-4 text-blue-600">
              <Car className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Véhicules récents</h3>
            <p className="text-gray-500 mt-2">Une flotte moderne et parfaitement entretenue.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 p-4 rounded-full mb-4 text-blue-600">
              <Clock className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Réservation rapide</h3>
            <p className="text-gray-500 mt-2">Votre véhicule réservé en moins de 2 minutes.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 p-4 rounded-full mb-4 text-blue-600">
              <CreditCard className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Paiement en agence</h3>
            <p className="text-gray-500 mt-2">Réglez directement sur place lors du retrait.</p>
          </div>
        </div>
      </section>

      <section id="catalogue" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Notre Catalogue</h2>
            <p className="text-gray-500 mt-2">Choisissez le véhicule qui correspond à vos besoins.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
          </div>
        ) : vehicules.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
            <Car className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Aucun véhicule disponible</h3>
            <p className="text-gray-500">Revenez un peu plus tard !</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicules.map((vehicule) => {
              const categorie = Array.isArray(vehicule.categories)
                ? vehicule.categories[0]?.libelle
                : vehicule.categories?.libelle;

              return (
                <article key={vehicule.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
                  <div className="h-56 bg-gray-100 relative">
                    {vehicule.image_url ? (
                      <img src={vehicule.image_url} alt={`Photo de ${vehicule.marque} ${vehicule.modele}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400" aria-hidden="true">
                        <Car className="h-16 w-16 opacity-30" />
                      </div>
                    )}
                    
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded text-xs font-bold text-gray-800 uppercase tracking-wide shadow-sm">
                      {categorie || 'Standard'}
                    </div>

                    {vehicule.statut === 'maintenance' && (
                      <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wide shadow-sm">
                        En maintenance
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{vehicule.marque}</h3>
                        <p className="text-gray-500">{vehicule.modele}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-blue-600">{vehicule.prix_jour}€</p>
                        <p className="text-xs text-gray-400 uppercase tracking-widest">/ jour</p>
                      </div>
                    </div>

                    <div className="mt-auto pt-6">
                      {vehicule.statut === 'disponible' ? (
                        <Link
                          to={`/vehicule/${vehicule.id}`}
                          className="block w-full text-center bg-gray-900 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                        >
                          Réserver ce véhicule
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="block w-full text-center bg-gray-100 text-gray-400 font-bold py-3 px-4 rounded-lg cursor-not-allowed"
                        >
                          Indisponible
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}