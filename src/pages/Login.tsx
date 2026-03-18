import React, { useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, AlertCircle, Loader2 } from "lucide-react";

/**
 * Page de connexion de l'application.
 * Interagit avec Supabase Auth pour valider les identifiants et initialiser la session utilisateur.
 */
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /**
   * Traite la soumission du formulaire et gère le retour de l'API d'authentification.
   */
  const handleLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    // Validation basique côté client
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Tentative de connexion via le service d'authentification
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Redirection vers l'accueil en cas de succès
      navigate("/");
    } catch (err) {
      console.error("Erreur d'authentification :", err);
      const errorMessage = err instanceof Error ? err.message : "Erreur de connexion.";

      // Traduction de l'erreur générique de Supabase pour une meilleure expérience utilisateur
      if (errorMessage === "Invalid login credentials") {
        setError("Email ou mot de passe incorrect.");
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
        <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Connexion
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ou{" "}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            créez un compte gratuitement
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

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                  placeholder="••••••••"
                />
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
                    Connexion en cours...
                  </>
                ) : (
                  "Se connecter"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}