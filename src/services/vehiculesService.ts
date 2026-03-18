import { supabase } from './supabase';
import type { Vehicule } from '../types/database';

/**
 * Service gérant les opérations CRUD pour l'entité Véhicule.
 * Permet d'isoler la logique d'accès aux données de l'interface utilisateur.
 */
export const vehiculeService = {
  
  /**
   * Récupère la liste complète des véhicules avec leur catégorie associée.
   * @returns {Promise<Vehicule[]>} Un tableau contenant tous les véhicules.
   */
  async getVehicules(): Promise<Vehicule[]> {
    const { data, error } = await supabase
      .from('vehicules')
      .select(`
        *,
        categorie:categories(*)
      `)
      .order('marque', { ascending: true });

    if (error) throw new Error(error.message);
    return data as Vehicule[];
  },

  /**
   * Récupère les détails d'un véhicule spécifique via son identifiant.
   * @param {number} id - L'identifiant unique du véhicule.
   * @returns {Promise<Vehicule>} Les données du véhicule demandé.
   */
  async getVehiculeById(id: number): Promise<Vehicule> {
    const { data, error } = await supabase
      .from('vehicules')
      .select(`
        *,
        categorie:categories(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data as Vehicule;
  },

  /**
   * Ajoute un nouveau véhicule dans la base de données.
   * @param {Omit<Vehicule, 'id' | 'categorie'>} vehicule - L'objet véhicule sans l'ID (généré par la BDD).
   * @returns {Promise<Vehicule>} Le véhicule nouvellement créé avec son ID.
   */
  async createVehicule(vehicule: Omit<Vehicule, 'id' | 'categorie'>): Promise<Vehicule> {
    const { data, error } = await supabase
      .from('vehicules')
      .insert([vehicule])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Vehicule;
  },

  /**
   * Met à jour les informations d'un véhicule existant.
   * @param {number} id - L'identifiant du véhicule à modifier.
   * @param {Partial<Omit<Vehicule, 'id' | 'categorie'>>} updates - Les champs à mettre à jour.
   * @returns {Promise<Vehicule>} Le véhicule mis à jour.
   */
  async updateVehicule(id: number, updates: Partial<Omit<Vehicule, 'id' | 'categorie'>>): Promise<Vehicule> {
    const { data, error } = await supabase
      .from('vehicules')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Vehicule;
  },

  /**
   * Supprime un véhicule de la base de données.
   * Échouera si le véhicule est lié à des réservations existantes car contrainte de clé étrangère.
   * @param {number} id - L'identifiant du véhicule à supprimer.
   */
  async deleteVehicule(id: number): Promise<void> {
    const { error } = await supabase
      .from('vehicules')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
};