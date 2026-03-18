import { supabase } from './supabase';
import type { OptionSupp } from '../types/database';

/**
 * Service gérant le catalogue des options supplémentaires (Siège bébé, GPS, etc.).
 */
export const optionsService = {
  
  /**
   * Récupère la liste de toutes les options disponibles.
   * Trie automatiquement du moins cher au plus cher pour un affichage logique côté client.
   * @returns {Promise<OptionSupp[]>} Le tableau des options.
   */
  async getOptions(): Promise<OptionSupp[]> {
    const { data, error } = await supabase
      .from('options_supp')
      .select('*')
      .order('prix_unitaire', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Crée une nouvelle option supplémentaire.
   * @param option - Les données de la nouvelle option (libellé et prix unitaire).
   * @returns {Promise<OptionSupp>} L'option fraîchement créée.
   */
  async createOption(option: { libelle: string; prix_unitaire: number }): Promise<OptionSupp> {
    const { data, error } = await supabase
      .from('options_supp')
      .insert([option])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Met à jour une option existante.
   * @param id - L'identifiant de l'option à modifier.
   * @param option - Les nouveaux champs à appliquer (libellé ou prix).
   * @returns {Promise<OptionSupp>} L'option mise à jour.
   */
  async updateOption(id: number, option: { libelle?: string; prix_unitaire?: number }): Promise<OptionSupp> {
    const { data, error } = await supabase
      .from('options_supp')
      .update(option)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Supprime définitivement une option de la base de données.
   * La requête échouera (erreur de contrainte) si l'option est déjà liée à une réservation existante.
   * @param id - L'identifiant de l'option à supprimer.
   */
  async deleteOption(id: number): Promise<void> {
    const { error } = await supabase
      .from('options_supp')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};