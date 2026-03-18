import { supabase } from './supabase';

/**
 * Service gérant toute la logique liée aux réservations.
 * Interagit avec les tables reservations, vehicules, options_supp et reservation_options.
 */
export const reservationService = {
  
  /**
   * Vérifie la disponibilité d'un véhicule sur une période donnée en évitant les chevauchements.
   * @param id_vehicule Identifiant du véhicule ciblé.
   * @param dateDebut Date de début souhaitée.
   * @param dateFin Date de fin souhaitée.
   * @returns {Promise<boolean>} Vrai si le véhicule est libre, Faux s'il est déjà réservé.
   */
  async checkDisponibilite(id_vehicule: number, dateDebut: string, dateFin: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('reservations')
      .select('id')
      .eq('id_vehicule', id_vehicule)
      .neq('statut', 'annulee') // Une réservation annulée ne bloque plus le véhicule
      .lte('date_debut', dateFin)
      .gte('date_fin', dateDebut);

    if (error) throw error;
    return data.length === 0;
  },

  /**
   * Récupère le catalogue des options supplémentaires proposées à la location.
   */
  async getOptions() {
    const { data, error } = await supabase
      .from('options_supp')
      .select('*')
      .order('prix_unitaire', { ascending: true });

    if (error) throw error;
    return data;
  },

  /**
   * Enregistre une nouvelle réservation et lie les options sélectionnées.
   * Effectue des insertions dans deux tables différentes (reservations puis reservation_options).
   */
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
    // Création de la réservation principale
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

    //  Ajout des options dans la table de liaison si le client en a choisi
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

  /**
   * Récupère l'historique complet des réservations d'un client spécifique.
   * Inclut les informations du véhicule et le détail des options via des jointures.
   * @param userId L'identifiant du client.
   */
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

  /**
   * Récupère toutes les réservations du système pour le tableau de bord administrateur.
   */
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

  /**
   * Modifie l'état d'une réservation et synchronise automatiquement le statut du véhicule associé.
   */
  async updateReservationStatut(id_reservation: number, id_vehicule: number, nouveauStatut: 'attente' | 'validee' | 'terminee' | 'annulee') {
    // Mise à jour de la réservation
    const { error: resError } = await supabase
      .from('reservations')
      .update({ statut: nouveauStatut })
      .eq('id', id_reservation);

    if (resError) throw resError;

    // Déduction logique du nouveau statut du véhicule
    let statutVehicule = null;
    if (nouveauStatut === 'validee') {
      statutVehicule = 'loue';
    } else if (nouveauStatut === 'terminee' || nouveauStatut === 'annulee') {
      statutVehicule = 'disponible';
    }

    // Mise à jour du véhicule si nécessaire
    if (statutVehicule) {
      const { error: vehError } = await supabase
        .from('vehicules')
        .update({ statut: statutVehicule })
        .eq('id', id_vehicule);

      if (vehError) throw vehError;
    }
    
    return true;
  },

  /**
   * Vérifie la disponibilité lors d'une modification de dates par le client.
   * Ignore volontairement la réservation actuelle pour éviter un faux conflit avec elle-même.
   */
  async checkDisponibiliteUpdate(id_vehicule: number, dateDebut: string, dateFin: string, id_reservation_actuelle: number): Promise<boolean> {
    const { data, error } = await supabase
      .from('reservations')
      .select('id')
      .eq('id_vehicule', id_vehicule)
      .neq('statut', 'annulee')
      .neq('id', id_reservation_actuelle) // Exclusion de la réservation en cours de modification
      .lte('date_debut', dateFin)
      .gte('date_fin', dateDebut);

    if (error) throw error;
    return data.length === 0;
  },

  /**
   * Applique les modifications d'une réservation (dates, prix) et met à jour ses options associées.
   */
  async updateReservationComplete(id_reservation: number, date_debut: string, date_fin: string, prix_total: number, new_options: number[]) {
    // Mise à jour des informations de base
    const { error: errUpdate } = await supabase
      .from('reservations')
      .update({ date_debut, date_fin, prix_total })
      .eq('id', id_reservation);

    if (errUpdate) throw errUpdate;

    // Nettoyage des anciennes options pour repartir sur une base saine
    const { error: errDel } = await supabase
      .from('reservation_options')
      .delete()
      .eq('id_reservation', id_reservation);

    if (errDel) throw errDel;

    // Insertion des nouvelles options choisies
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