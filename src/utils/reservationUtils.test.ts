import { describe, it, expect } from 'vitest';
import { calculerPrixTotal } from './reservationUtils';

describe('Algorithme de calcul de prix de réservation', () => {
  const optionsDispos = [
    { id: 1, libelle: 'GPS', prix_unitaire: 5 },
    { id: 2, libelle: 'Siège Bébé', prix_unitaire: 10 }
  ];

  it('doit calculer correctement le prix pour 1 jour sans option', () => {
    const prix = calculerPrixTotal('2026-06-06', '2026-06-06', 50, optionsDispos, []);
    expect(prix).toBe(50);
  });

  it('doit calculer correctement le prix pour 3 jours sans option', () => {
    const prix = calculerPrixTotal('2026-06-06', '2026-06-08', 50, optionsDispos, []);
    expect(prix).toBe(150);
  });

  it('doit inclure le prix des options sélectionnées sur plusieurs jours', () => {
    const prix = calculerPrixTotal('2026-06-06', '2026-06-08', 50, optionsDispos, [1, 2]);
    expect(prix).toBe(195);
  });

  it('doit retourner 0 si la date de fin est antérieure à la date de début', () => {
    const prix = calculerPrixTotal('2026-06-10', '2026-06-06', 50, optionsDispos, []);
    expect(prix).toBe(0);
  });

  it('doit ignorer les ID d options qui n existent pas dans le catalogue', () => {
    const prix = calculerPrixTotal('2026-06-06', '2026-06-06', 50, optionsDispos, [99]);
    expect(prix).toBe(50);
  });
});