import { createContext } from 'react';
import type { User } from '@supabase/supabase-js';
import type { Profil } from '../types/database';

/**
 * Définit le "contrat" de ce qui sera accessible via le hook useAuth().
 */
export interface AuthContextType {
  // L'objet utilisateur brut géré par le système d'authentification de Supabase
  user: User | null;
  
  // Les informations métier complémentaires tirées de notre table "profils"
  profil: Profil | null;
  
  // Indicateur permettant de bloquer l'affichage tant que la session n'est pas vérifiée
  loading: boolean;
  
  // Fonction globale pour se déconnecter depuis n'importe quel composant
  logout: () => Promise<void>;
}

/**
 * Création du contexte React pour l'authentification.
 * Volontairement initialisé à "undefined" pour forcer la vérification de sécurité 
 * dans le hook useAuth
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);