# 🚗 Projet de Location de Véhicules

Bonjour ! Bienvenue sur le repo de mon projet de certification. Je m'appelle Mounir SEBTI et j'ai développé cette application web dans le cadre de mon BTS SIO (option SLAM).

L'idée de base, c'était de coder une plateforme de réservation de A à Z, en me mettant dans la peau d'un développeur full-stack, avec une vraie gestion de base de données derrière.

## 💡 Ce que fait l'appli

J'ai séparé le projet en deux vrais espaces :
- **L'Espace Client :** L'utilisateur arrive sur un catalogue dynamique (les voitures déjà louées ou en panne n'apparaissent pas, c'est géré en direct). Il peut choisir ses dates, cocher des options (siège bébé, GPS...), et l'algorithme calcule le prix total. Il a ensuite accès à un dashboard pour gérer, modifier les dates ou annuler ses réservations.
- **Le Back-Office Admin :** L'administrateur gère sa flotte et valide ou termine les locations. Si une résa est annulée ou terminée, le statut de la voiture repasse automatiquement en "disponible" dans la base.

## 🛠️ La stack technique (et pourquoi je l'ai choisie)

Je voulais utiliser des technos modernes pour être raccord avec les attentes du marché du travail :
- **Front :** React avec TypeScript. Le typage fort de TS m'a sauvé de pas mal de bugs bêtes pendant le développement. Pour le style, j'ai utilisé Tailwind CSS pour faire une interface propre sans me perdre dans des fichiers CSS à rallonge.
- **Back / BDD :** J'ai utilisé Supabase (qui tourne sous PostgreSQL). Tout est sécurisé directement dans la base de données avec des règles RLS (Row Level Security). Comme ça, je suis sûr à 100 % qu'un client ne peut pas bidouiller et modifier la réservation d'un autre.
- **Qualité :** J'ai mis en place Vitest pour tester mon algorithme de calcul de prix et m'assurer que les edge cases (comme des dates inversées) sont bien bloqués.

## ⚙️ Comment lancer le projet en local ?

Si vous voulez cloner le projet et tester la bête sur votre machine :

1. Clonez ce repository.
2. Installez les dépendances avec un petit `npm install`.
3. Créez un fichier `.env` à la racine et glissez-y les clés Supabase :
   `VITE_SUPABASE_URL=votre_url`
   `VITE_SUPABASE_ANON_KEY=votre_cle`
4. Lancez `npm run dev` et c'est parti !