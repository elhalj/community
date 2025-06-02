# Seguikro Frontend

## Description
Interface utilisateur pour l'application de cotisation mensuelle Seguikro. Cette application React permet aux utilisateurs de gérer les cotisations, les groupes et les transactions.

## Structure du Projet

### Fichiers Principaux
- **index.html** - Point d'entrée HTML de l'application.
- **vite.config.js** - Configuration de Vite pour le développement et la production.
- **package.json** - Configuration du projet et dépendances.
- **eslint.config.js** - Configuration d'ESLint pour le linting du code.

### Répertoires

#### `/public`
Contient les fichiers statiques accessibles publiquement.

#### `/src`
Contient tout le code source de l'application.

#### `/src/assets`
Contient les ressources statiques comme les images, les icônes, etc.

#### `/src/components`
Contient les composants React réutilisables.
- **Footer.jsx** - Composant de pied de page.
- **Navbar.jsx** - Barre de navigation de l'application.

#### `/src/hooks`
Contient les hooks personnalisés pour la gestion de l'état et les appels API.
- **useAuth.js** - Hook pour gérer l'authentification (connexion, inscription, déconnexion).
- **useCotisations.js** - Hook pour gérer les cotisations (création, mise à jour, suppression, etc.).
- **useGroupes.js** - Hook pour gérer les groupes (création, mise à jour, suppression, etc.).
- **useTransactions.js** - Hook pour gérer les transactions (création, mise à jour, suppression, etc.).

#### `/src/layouts`
Contient les composants de mise en page.

#### `/src/pages`
Contient les composants de page principaux.
- **CotisationDetail.jsx** - Page de détail d'une cotisation.
- **CotisationForm.jsx** - Formulaire pour créer/modifier une cotisation.
- **Cotisations.jsx** - Liste des cotisations.
- **Dashboard.jsx** - Tableau de bord principal.
- **GroupeDetail.jsx** - Page de détail d'un groupe.
- **GroupeForm.jsx** - Formulaire pour créer/modifier un groupe.
- **GroupeMembres.jsx** - Gestion des membres d'un groupe.
- **GroupeTransactions.jsx** - Transactions d'un groupe.
- **Groupes.jsx** - Liste des groupes.
- **Home.jsx** - Page d'accueil.
- **Login.jsx** - Page de connexion.
- **NotFound.jsx** - Page 404.
- **Profile.jsx** - Profil utilisateur.
- **Register.jsx** - Page d'inscription.
- **TransactionForm.jsx** - Formulaire pour créer/modifier une transaction.

#### `/src/services`
Contient les services pour les appels API.
- **api.js** - Configuration d'Axios pour les appels API.
- **authService.js** - Service pour les appels API d'authentification.
- **cotisationService.js** - Service pour les appels API de cotisations.
- **groupeService.js** - Service pour les appels API de groupes.
- **transactionService.js** - Service pour les appels API de transactions.

#### `/src/store`
Contient la gestion de l'état global avec Zustand.
- **authStore.js** - Store pour l'état d'authentification.
- **cotisationStore.js** - Store pour l'état des cotisations.

#### `/src/utils`
Contient des utilitaires et fonctions d'aide.

## Technologies Utilisées
- **React** - Bibliothèque JavaScript pour construire l'interface utilisateur.
- **Vite** - Outil de build rapide pour le développement moderne.
- **React Router** - Routage côté client.
- **React Query** - Gestion des données côté client et cache.
- **Zustand** - Gestion de l'état global.
- **Axios** - Client HTTP pour les appels API.
- **React Hook Form** - Gestion des formulaires.
- **Yup** - Validation des schémas.
- **Mantine** - Bibliothèque de composants UI.
- **Tailwind CSS** - Framework CSS utilitaire.
- **React Toastify** - Notifications toast.
- **React Icons** - Bibliothèque d'icônes.

## Installation
```bash
# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev

# Construire pour la production
npm run build

# Prévisualiser la build de production
npm run preview
```

## Configuration
L'application est configurée pour communiquer avec l'API backend. Assurez-vous que l'API backend est en cours d'exécution sur le port spécifié dans le fichier `src/services/api.js`.

## Fonctionnalités

### Authentification
- Inscription d'un nouvel utilisateur
- Connexion d'un utilisateur existant
- Déconnexion
- Gestion du profil utilisateur

### Cotisations
- Création d'une nouvelle cotisation
- Modification d'une cotisation existante
- Suppression d'une cotisation
- Visualisation des détails d'une cotisation
- Filtrage des cotisations par période

### Groupes
- Création d'un nouveau groupe
- Modification d'un groupe existant
- Suppression d'un groupe
- Gestion des membres d'un groupe
- Visualisation des transactions d'un groupe

### Transactions
- Création d'une nouvelle transaction
- Modification d'une transaction existante
- Suppression d'une transaction
- Visualisation des détails d'une transaction

## Bonnes Pratiques
- Utilisation des hooks React pour la gestion de l'état
- Séparation des préoccupations avec des composants réutilisables
- Validation des formulaires avec Yup
- Gestion efficace des appels API avec React Query
- Gestion de l'état global avec Zustand
- Interface utilisateur responsive avec Tailwind CSS

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
