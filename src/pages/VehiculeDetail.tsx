import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { vehiculeService } from "../services/vehiculesService";
import { reservationService } from "../services/reservationService";
import type { Vehicule, OptionSupp } from "../types/database";
import { Car, ArrowLeft } from "lucide-react";
import OptionsSelector from "../components/vehicules/OptionsSelector";
import ReservationSidebar from "../components/vehicules/ReservationSidebar";

/**
 * Page de configuration et de réservation d'un véhicule.
 * Gère le calcul du prix en temps réel et la vérification des disponibilités.
 */
export default function VehiculeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // États liés aux données de la base
  const [vehicule, setVehicule] = useState<Vehicule | null>(null);
  const [optionsDispos, setOptionsDispos] = useState<OptionSupp[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // États liés aux choix du client
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        if (!id) return;

        const [vehiculeData, optionsData] = await Promise.all([
          vehiculeService.getVehiculeById(Number(id)),
          reservationService.getOptions(),
        ]);

        if (isMounted) {
          setVehicule(vehiculeData);
          setOptionsDispos(optionsData || []);
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement des détails du véhicule :",
          error,
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Variables calculées à la volée
  let erreurDates = "";
  let prixTotal = 0;

  if (dateDebut && dateFin && vehicule) {
    const start = new Date(dateDebut);
    const end = new Date(dateFin);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    // Blocage des dates illogiques
    if (end < start) {
      erreurDates = "La date de retour doit être après la date de départ.";
    } else {
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      const optionsPrixJournalier = selectedOptions.reduce((acc, optId) => {
        const option = optionsDispos.find((o) => o.id === optId);
        return acc + (option ? Number(option.prix_unitaire) : 0);
      }, 0);

      prixTotal =
        diffDays * (Number(vehicule.prix_jour) + optionsPrixJournalier);
    }
  }

  const toggleOption = (idOpt: number) => {
    setSelectedOptions((prev) =>
      prev.includes(idOpt) ? prev.filter((x) => x !== idOpt) : [...prev, idOpt],
    );
  };

  /**
   * Valide et enregistre la réservation après vérification des contraintes.
   */
  const handleReservation = async () => {
    // Redirection si l'utilisateur n'est pas authentifié
    if (!user) {
      navigate("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      // Double vérification côté base de données pour éviter le chevauchement
      const isAvailable = await reservationService.checkDisponibilite(
        Number(id),
        dateDebut,
        dateFin,
      );
      if (!isAvailable) {
        alert(
          "Désolé, ce véhicule est déjà réservé sur ces dates. Veuillez modifier votre période.",
        );
        setIsSubmitting(false);
        return;
      }

      // Création de la réservation et insertion des options
      await reservationService.createReservation(
        {
          id_profil: user.id,
          id_vehicule: Number(id),
          date_debut: dateDebut,
          date_fin: dateFin,
          prix_total: prixTotal,
        },
        selectedOptions,
      );

      alert("Réservation confirmée avec succès !");
      navigate("/dashboard");
    } catch (error) {
      console.error("Erreur de traitement de la réservation :", error);
      alert("Une erreur est survenue lors de la réservation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Affichage du loader pendant la récupération des données
  if (loading) {
    return (
      <main
        className="min-h-screen flex items-center justify-center bg-[#F9F9F5]"
        aria-busy="true"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </main>
    );
  }

  // Gestion de l'erreur 404 (Véhicule non trouvé)
  if (!vehicule) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Véhicule introuvable
        </h1>
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center"
        >
          <ArrowLeft className="h-5 w-5 mr-2" aria-hidden="true" /> Retour au
          catalogue
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-[#F9F9F5] min-h-screen pb-32">
      <header className="bg-white border-b border-gray-200 pt-6 pb-6 px-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-blue-500 transition-colors"
            aria-label="Retourner au catalogue"
          >
            <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" /> Retour
          </Link>
          <span
            className="text-xs uppercase tracking-widest font-bold text-blue-500"
            aria-hidden="true"
          >
            Configuration
          </span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto mt-8 px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <section className="lg:w-3/5" aria-labelledby="vehicule-title">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="h-64 sm:h-96 relative bg-gray-100">
                {vehicule.image_url ? (
                  <img
                    src={vehicule.image_url}
                    alt={`Photo de ${vehicule.marque} ${vehicule.modele}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="flex items-center justify-center h-full text-gray-400"
                    aria-hidden="true"
                  >
                    <Car className="h-32 w-32 opacity-50" />
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded shadow-lg">
                  {vehicule.categorie?.libelle || "Standard"}
                </div>
              </div>

              <div className="p-8">
                <h1
                  id="vehicule-title"
                  className="text-4xl font-serif font-extrabold text-gray-900 leading-tight mb-2"
                >
                  {vehicule.marque}{" "}
                  <span className="font-light">{vehicule.modele}</span>
                </h1>
                <p className="text-gray-500 flex items-center mb-8">
                  Plaque :{" "}
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded ml-2">
                    {vehicule.immatriculation}
                  </span>
                </p>

                <OptionsSelector
                  options={optionsDispos}
                  selectedOptions={selectedOptions}
                  onToggle={toggleOption}
                />
              </div>
            </div>
          </section>

          <ReservationSidebar
            vehicule={vehicule}
            dateDebut={dateDebut}
            dateFin={dateFin}
            setDateDebut={setDateDebut}
            setDateFin={setDateFin}
            erreurDates={erreurDates}
            prixTotal={prixTotal}
            selectedOptionsCount={selectedOptions.length}
            onReserve={handleReservation}
            isSubmitting={isSubmitting}
            isLoggedIn={!!user}
          />
        </div>
      </div>
    </main>
  );
}
