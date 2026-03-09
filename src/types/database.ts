export type Role = 'admin' | 'client';
export type StatutVehicule = 'disponible' | 'maintenance' | 'loue';
export type StatutReservation = 'attente' | 'validee' | 'terminee' | 'annulee';

export interface Profil {
  id: string; 
  email: string;
  role: Role;
  nom: string;
  prenom: string;
  telephone?: string;
}

export interface Categorie {
  id: number;
  libelle: string;
  description?: string;
}

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

export interface OptionSupp {
  id: number;
  libelle: string;
  prix_unitaire: number;
}

export interface Reservation {
  id: number;
  id_vehicule: number;
  id_profil: string;
  date_debut: string; 
  date_fin: string;
  statut: StatutReservation;
  prix_total: number;
}

export interface ReservationOption {
  id_reservation: number;
  id_option: number;
}
