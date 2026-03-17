import { supabase } from './supabase';
import type { Vehicule } from '../types/database';

export const vehiculeService = {
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

  async createVehicule(vehicule: Omit<Vehicule, 'id' | 'categorie'>): Promise<Vehicule> {
    const { data, error } = await supabase
      .from('vehicules')
      .insert([vehicule])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Vehicule;
  },

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

  async deleteVehicule(id: number): Promise<void> {
    const { error } = await supabase
      .from('vehicules')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
};