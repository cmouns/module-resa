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
    // Un seul point d'entrée : on écoute les changements d'état auth.
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      
      // Cas 1 : pas de session (déconnecté ou jamais connecté)
      if (!session) {
        setUser(null);
        setProfil(null);
        setLoading(false);
        return;
      }

      // session active, on met à jour le user et on cherche le profil
      setUser(session.user);

      try {
        const { data: profilData, error } = await supabase
          .from('profils')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error("Erreur récupération profil :", error);
          setProfil(null);
        } else {
          setProfil(profilData as Profil);
        }
      } catch (err) {
        console.error("Erreur inattendue :", err);
        setProfil(null);
      } finally {
        setLoading(false);
      }
    });

    // On coupe l'écouteur quand le composant disparaît
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  /**
   * Déconnecte l'utilisateur proprement.
   */
  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, profil, loading, logout }}>
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