interface OptionSupp {
  id: number;
  libelle: string;
  prix_unitaire: number;
}

export function calculerPrixTotal(
  dateDebut: string,
  dateFin: string,
  prixJourVehicule: number,
  optionsDispos: OptionSupp[],
  selectedOptionIds: number[]
): number {
  if (!dateDebut || !dateFin) return 0;

  const start = new Date(dateDebut);
  const end = new Date(dateFin);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  if (end < start) return 0;

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  const optionsPrixJournalier = selectedOptionIds.reduce((acc, optId) => {
    const option = optionsDispos.find(o => o.id === optId);
    return acc + (option ? Number(option.prix_unitaire) : 0);
  }, 0);

  return diffDays * (Number(prixJourVehicule) + optionsPrixJournalier);
}