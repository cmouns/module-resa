import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { AuthContext } from './AuthContext';
import type { Profil } from '../types/database';
import type { User } from '@supabase/supabase-js';

/**
 * Enveloppe l'application pour rendre l'état de la session (connecté/déconnecté) 
 * et les données du profil accessibles depuis n'importe quel composant enfant.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profil, setProfil] = useState<Profil | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /**
     * Vérifie s'il existe déjà une session active au lancement de l'application
     */
    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        // Si la session est invalide ou expirée, on purge tout par sécurité
        if (error || !data.session) {
          await supabase.auth.signOut().catch(() => {});
          localStorage.clear();
          setUser(null);
          setProfil(null);
          setLoading(false);
          return;
        }

        setUser(data.session.user);

        // Récupération des informations complémentaires du profil
        const { data: profilData, error: profilError } = await supabase
          .from('profils')
          .select('*')
          .eq('id', data.session.user.id)
          .single();

        if (profilData && !profilError) {
          setProfil(profilData as Profil);
        } else {
          setProfil(null);
        }

      } catch (error) {
        console.error("Erreur d'initialisation auth:", error);
        localStorage.clear();
        setUser(null);
        setProfil(null);
      } finally {
        setLoading(false); 
      }
    };

    initializeAuth();

    /**
     * Mise en place d'un Listener Supabase.
     * Intercepte en temps réel les changements d'état par exemple si l'utilisateur se déconnecte depuis un autre onglet.
     */
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        localStorage.clear();
        setUser(null);
        setProfil(null);
        setLoading(false);
        return;
      }

      setUser(session.user);

      try {
        const { data: profilData } = await supabase
          .from('profils')
          .select('*')
          .eq('id', session.user.id)
          .single();

        setProfil((profilData as Profil) || null);
      } catch (error) {
        console.error("Erreur changement auth:", error);
        setProfil(null);
      } finally {
        setLoading(false);
      }
    });

    // Évite les fuites de mémoire en coupant l'écouteur.
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  /**
   * Déconnecte l'utilisateur proprement en détruisant la session côté serveur
   * et en nettoyant les états et le cache côté client.
   */
  const logout = async () => {
    await supabase.auth.signOut().catch(() => {});
    localStorage.clear();
    setUser(null);
    setProfil(null);
  };

  return (
    <AuthContext.Provider value={{ user, profil, loading, logout }}>
      {/* Empêche l'affichage de l'application tant que la session n'est pas vérifiée */}
      {loading ? (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50" aria-busy="true">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};