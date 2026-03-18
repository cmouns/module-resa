import React, { useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, User, AlertCircle, Loader2 } from "lucide-react";

/**
 * Page d'inscription pour les nouveaux utilisateurs.
 * Gère la création des identifiants et l'enregistrement des données personnelles.
 */
export default function Register() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rgpdConsent, setRgpdConsent] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /**
   * Traite la soumission du formulaire d'inscription.
   */
  const handleRegister = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    // Validation basique côté front-end
    if (!nom || !prenom || !email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    // TODO  : Il faudrait enregistrer la valeur 
    // et l'horodatage de ce consentement directement dans la base de données.
    if (!rgpdConsent) {
      setError("Vous devez accepter les conditions d'utilisation et la politique de confidentialité.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Création sécurisée du compte dans le service d'authentification Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error("Erreur inattendue lors de la création du compte.");
      }

      //  Insertion des informations complémentaires dans la table publique "profils"
      const { error: dbError } = await supabase.from("profils").insert([
        {
          id: authData.user.id,
          email: email,
          nom: nom,
          prenom: prenom,
          role: "client",
        },
      ]);

      if (dbError) {
        console.error(dbError);
        throw new Error("Erreur lors de l'enregistrement du profil.");
      }

      // Redirection vers l'accueil une fois l'inscription terminée
      navigate("/");
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de l'inscription.";

      // Personnalisation du message d'erreur pour l'utilisateur
      if (errorMessage === "User already registered") {
        setError("Cet email est déjà utilisé.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Inscription
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ou{" "}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            connectez-vous à votre compte
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-md flex items-start" role="alert">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2 shrink-0" aria-hidden="true" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleRegister}>
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700">Nom</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="nom"
                  name="nom"
                  type="text"
                  required
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                  placeholder="Dupont"
                />
              </div>
            </div>

            <div>
              <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">Prénom</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="prenom"
                  name="prenom"
                  type="text"
                  required
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                  placeholder="Jean"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse email</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                  placeholder="vous@exemple.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="rgpd"
                  name="rgpd"
                  type="checkbox"
                  required
                  checked={rgpdConsent}
                  onChange={(e) => setRgpdConsent(e.target.checked)}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded cursor-pointer"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="rgpd" className="font-medium text-gray-700 cursor-pointer">
                  J'accepte que mes données soient traitées dans le cadre de la location de véhicules.
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" aria-hidden="true" />
                    Inscription en cours...
                  </>
                ) : (
                  "S'inscrire"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}