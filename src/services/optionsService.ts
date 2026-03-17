import { supabase } from './supabase';
import type { OptionSupp } from '../types/database';

export const optionsService = {
  async getOptions(): Promise<OptionSupp[]> {
    const { data, error } = await supabase
      .from('options_supp')
      .select('*')
      .order('prix_unitaire', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createOption(option: { libelle: string; prix_unitaire: number }) {
    const { data, error } = await supabase
      .from('options_supp')
      .insert([option])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateOption(id: number, option: { libelle?: string; prix_unitaire?: number }) {
    const { data, error } = await supabase
      .from('options_supp')
      .update(option)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteOption(id: number) {
    const { error } = await supabase
      .from('options_supp')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};