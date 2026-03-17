import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { AuthContext } from './AuthContext';
import type { Profil } from '../types/database';
import type { User } from '@supabase/supabase-js';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profil, setProfil] = useState<Profil | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          await supabase.auth.signOut().catch(() => {});
          localStorage.clear();
          setUser(null);
          setProfil(null);
          setLoading(false);
          return;
        }

        setUser(data.session.user);

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

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut().catch(() => {});
    localStorage.clear();
    setUser(null);
    setProfil(null);
  };

  return (
    <AuthContext.Provider value={{ user, profil, loading, logout }}>
      {loading ? (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};