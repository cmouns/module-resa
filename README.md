# Projet de location de véhicules — Module réservation

Application web de réservation de véhicules développée dans le cadre du BTS SIO (option SLAM).

**Démo en ligne :** https://module-resav1-lbjs4l413-cmouns-projects.vercel.app/

## Fonctionnalités

**Espace client**
- Catalogue des véhicules disponibles (filtré en temps réel selon le statut)
- Configuration d'une réservation : dates, options supplémentaires, calcul du prix
- Tableau de bord pour consulter, modifier ou annuler ses réservations

**Back-office administrateur**
- Gestion du parc de véhicules (CRUD)
- Gestion des catégories et des options supplémentaires
- Suivi des réservations et validation du cycle de vie (attente → validée → terminée)

## Stack technique

- **Front** : React 19, TypeScript, Tailwind CSS, Vite
- **Backend** : Supabase (PostgreSQL, Auth, Row Level Security)
- **Tests** : Vitest (algorithme de calcul de prix)
- **CI/CD** : Déploiement automatique via Vercel, workflow GitHub Actions pour maintenir la base active

## Installation locale

```bash
npm install
```

Créer un fichier `.env` à la racine :
VITE_SUPABASE_URL=votre_url
VITE_SUPABASE_ANON_KEY=votre_cle

Puis :

```bash
npm run dev
```

## Tests

```bash
npm run test
```