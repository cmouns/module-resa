import type { OptionSupp } from "../types/database";

/**
 * Calcule le prix total d'une réservation.
 * * @param dateDebut Date de départ sélectionnée
 * @param dateFin Date de retour sélectionnée
 * @param prixJourVehicule Prix de base du véhicule par jour
 * @param optionsDispos Liste de toutes les options de la base de données
 * @param selectedOptionIds Tableau des ID des options cochées par le client
 * @returns Le prix total calculé qui retourne 0 si les dates sont invalides
 */
export function calculerPrixTotal(
  dateDebut: string,
  dateFin: string,
  prixJourVehicule: number,
  optionsDispos: OptionSupp[],
  selectedOptionIds: number[],
): number {
  if (!dateDebut || !dateFin) return 0;

  // Remise à zéro des heures pour éviter les décalages liés aux fuseaux horaires
  const start = new Date(dateDebut);
  const end = new Date(dateFin);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  // La date de retour ne peut pas être avant la date de départ
  if (end < start) return 0;

  // Calcul du nombre de jours de location (+1 pour inclure la journée de départ)
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  // Calcul du prix supplémentaire par jour en fonction des options cochées
  const optionsPrixJournalier = selectedOptionIds.reduce((acc, optId) => {
    const option = optionsDispos.find((o) => o.id === optId);
    return acc + (option ? Number(option.prix_unitaire) : 0);
  }, 0);

  return diffDays * (Number(prixJourVehicule) + optionsPrixJournalier);
}
