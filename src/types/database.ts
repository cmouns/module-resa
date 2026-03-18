// Définition des rôles pour séparer les accès sur l'application
export type Role = 'admin' | 'client';

// Les différents états possibles pour une voiture dans le parc
export type StatutVehicule = 'disponible' | 'maintenance' | 'loue';

// Le cycle de vie d'une réservation, de la demande jusqu'à la fin
export type StatutReservation = 'attente' | 'validee' | 'terminee' | 'annulee';

/**
 * Structure d'un utilisateur (Table profils).
 */
export interface Profil {
  id: string; 
  email: string;
  role: Role;
  nom: string;
  prenom: string;
  telephone?: string; 
}

/**
 * Famille d'un véhicule (ex: Citadine, SUV, Utilitaire).
 */
export interface Categorie {
  id: number;
  libelle: string;
  description?: string;
}

/**
 * Modèle de données pour une voiture (Table vehicules).
 */
export interface Vehicule {
  id: number;
  marque: string;
  modele: string;
  immatriculation: string;
  prix_jour: number;
  statut: StatutVehicule;
  image_url?: string;
  id_categorie: number;
  categorie?: Categorie; 
}

/**
 * Les extras proposés pendant la location (GPS, Siège bébé...).
 */
export interface OptionSupp {
  id: number;
  libelle: string;
  prix_unitaire: number;
}

/**
 * Trace une demande de location liant un client à un véhicule.
 */
export interface Reservation {
  id: number;
  id_vehicule: number;
  id_profil: string;
  date_debut: string; 
  date_fin: string;
  statut: StatutReservation;
  prix_total: number;
}

/**
 * Table de liaison pour savoir quelles options ont été choisies pour une réservation.
 */
export interface ReservationOption {
  id_reservation: number;
  id_option: number;
}