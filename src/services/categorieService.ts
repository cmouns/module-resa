import { supabase } from './supabase';
import type { Categorie } from '../types/database';

export const categorieService = {
  async getCategories(): Promise<Categorie[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('libelle', { ascending: true });

    if (error) throw new Error(error.message);
    return data as Categorie[];
  },

  async getCategorieById(id: number): Promise<Categorie> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data as Categorie;
  },

  async createCategorie(categorie: Omit<Categorie, 'id'>): Promise<Categorie> {
    const { data, error } = await supabase
      .from('categories')
      .insert([categorie])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Categorie;
  },

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

  async deleteCategorie(id: number): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
};