import { supabase } from './supabase';
import type { Categorie } from '../types/database';

/**
 * Service dédié à la gestion des catégories de véhicules (Berline, SUV, Utilitaire, etc.).
 * Utilisé principalement dans le pannel administrateur pour le catalogue.
 */
export const categorieService = {
  
  /**
   * Récupère la liste de toutes les catégories.
   * Trie par ordre alphabétique pour faciliter la lecture dans les menus déroulants.
   * @returns {Promise<Categorie[]>} Tableau contenant les catégories.
   */
  async getCategories(): Promise<Categorie[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('libelle', { ascending: true });

    if (error) throw new Error(error.message);
    return data as Categorie[];
  },

  /**
   * Récupère les détails d'une catégorie spécifique.
   * @param {number} id - L'identifiant de la catégorie.
   * @returns {Promise<Categorie>} L'objet catégorie correspondant.
   */
  async getCategorieById(id: number): Promise<Categorie> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data as Categorie;
  },

  /**
   * Ajoute une nouvelle catégorie dans la base de données.
   * @param {Omit<Categorie, 'id'>} categorie - Les données de la catégorie sans l'ID.
   * @returns {Promise<Categorie>} La catégorie créée avec son nouvel identifiant.
   */
  async createCategorie(categorie: Omit<Categorie, 'id'>): Promise<Categorie> {
    const { data, error } = await supabase
      .from('categories')
      .insert([categorie])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Categorie;
  },

  /**
   * Modifie les informations d'une catégorie existante (libellé ou description).
   * @param {number} id - L'identifiant de la catégorie à modifier.
   * @param {Partial<Omit<Categorie, 'id'>>} updates - Les champs à mettre à jour.
   * @returns {Promise<Categorie>} La catégorie mise à jour.
   */
  async updateCategorie(id: number, updates: Partial<Omit<Categorie, 'id'>>): Promise<Categorie> {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Categorie;
  },

  /**
   * Supprime une catégorie de la base de données.
   * Échouera si la catégorie est encore attribuée à un ou plusieurs véhicules.
   * @param {number} id - L'identifiant de la catégorie à supprimer.
   */
  async deleteCategorie(id: number): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
};