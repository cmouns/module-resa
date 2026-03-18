import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Permet de récupérer l'utilisateur, son profil et les fonctions de connexion/déconnexion.
 * * @returns {AuthContextType} Le contexte d'authentification.
 * @throws {Error} Si le hook est utilisé en dehors d'un AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // Si context est undefined, cela signifie que le composant 
  // qui appelle useAuth n'est pas enveloppé par <AuthProvider> dans App.tsx.
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  
  return context;
};