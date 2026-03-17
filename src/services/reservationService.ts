import { supabase } from './supabase';

export const reservationService = {
  async checkDisponibilite(id_vehicule: number, dateDebut: string, dateFin: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('reservations')
      .select('id')
      .eq('id_vehicule', id_vehicule)
      .neq('statut', 'annulee')
      .lte('date_debut', dateFin)
      .gte('date_fin', dateDebut);

    if (error) throw error;
    return data.length === 0;
  },

  async getOptions() {
    const { data, error } = await supabase
      .from('options_supp')
      .select('*')
      .order('prix_unitaire', { ascending: true });

    if (error) throw error;
    return data;
  },

  async createReservation(
    reservation: {
      id_profil: string;
      id_vehicule: number;
      date_debut: string;
      date_fin: string;
      prix_total: number;
    },
    optionsIds: number[] = []
  ) {
    const { data: resData, error: resError } = await supabase
      .from('reservations')
      .insert([{
        id_profil: reservation.id_profil,
        id_vehicule: reservation.id_vehicule,
        date_debut: reservation.date_debut,
        date_fin: reservation.date_fin,
        prix_total: reservation.prix_total,
        statut: 'attente'
      }])
      .select()
      .single();

    if (resError) throw resError;

    if (optionsIds.length > 0) {
      const optionsToInsert = optionsIds.map(id_opt => ({
        id_reservation: resData.id,
        id_option: id_opt
      }));

      const { error: optError } = await supabase
        .from('reservation_options')
        .insert(optionsToInsert);

      if (optError) throw optError;
    }
    
    return resData;
  },

  async getUserReservations(userId: string) {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        id,
        date_debut,
        date_fin,
        statut,
        prix_total,
        vehicules (id, marque, modele, image_url, prix_jour),
        reservation_options (
          id_option,
          options_supp (libelle)
        )
      `)
      .eq('id_profil', userId)
      .order('date_debut', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getAllReservations() {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        id,
        id_vehicule,
        date_debut,
        date_fin,
        statut,
        prix_total,
        profils (nom, prenom, email),
        vehicules (marque, modele, immatriculation)
      `)
      .order('date_debut', { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateReservationStatut(id_reservation: number, id_vehicule: number, nouveauStatut: 'attente' | 'validee' | 'terminee' | 'annulee') {
    const { error: resError } = await supabase
      .from('reservations')
      .update({ statut: nouveauStatut })
      .eq('id', id_reservation);

    if (resError) throw resError;

    let statutVehicule = null;
    if (nouveauStatut === 'validee') {
      statutVehicule = 'loue';
    } else if (nouveauStatut === 'terminee' || nouveauStatut === 'annulee') {
      statutVehicule = 'disponible';
    }

    if (statutVehicule) {
      const { error: vehError } = await supabase
        .from('vehicules')
        .update({ statut: statutVehicule })
        .eq('id', id_vehicule);

      if (vehError) throw vehError;
    }
    
    return true;
  },

  async checkDisponibiliteUpdate(id_vehicule: number, dateDebut: string, dateFin: string, id_reservation_actuelle: number): Promise<boolean> {
    const { data, error } = await supabase
      .from('reservations')
      .select('id')
      .eq('id_vehicule', id_vehicule)
      .neq('statut', 'annulee')
      .neq('id', id_reservation_actuelle)
      .lte('date_debut', dateFin)
      .gte('date_fin', dateDebut);

    if (error) throw error;
    return data.length === 0;
  },

  async updateReservationComplete(id_reservation: number, date_debut: string, date_fin: string, prix_total: number, new_options: number[]) {
    const { error: errUpdate } = await supabase
      .from('reservations')
      .update({ date_debut, date_fin, prix_total })
      .eq('id', id_reservation);

    if (errUpdate) throw errUpdate;

    const { error: errDel } = await supabase
      .from('reservation_options')
      .delete()
      .eq('id_reservation', id_reservation);

    if (errDel) throw errDel;

    if (new_options.length > 0) {
      const optionsToInsert = new_options.map(id_opt => ({
        id_reservation: id_reservation,
        id_option: id_opt
      }));

      const { error: errIns } = await supabase
        .from('reservation_options')
        .insert(optionsToInsert);

      if (errIns) throw errIns;
    }

    return true;
  }
};