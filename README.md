# Seguikro Backend

## Description
Backend API pour l'application de cotisation mensuelle Seguikro. Cette API gère l'authentification, les cotisations, les groupes et les transactions.

## Structure du Projet

### Fichiers Principaux
- **server.js** - Point d'entrée de l'application qui configure Express, connecte à MongoDB, initialise Redis et démarre le serveur.
- **package.json** - Configuration du projet et dépendances.

### Répertoires

#### `/src/config`
Contient les fichiers de configuration pour la base de données et autres services.
- **db.js** - Configuration de la connexion à MongoDB.

#### `/src/controllers`
Contient la logique métier de l'application.
- **authController.js** - Gestion de l'authentification (inscription, connexion, etc.).
- **cotisationController.js** - Gestion des cotisations (création, mise à jour, suppression, etc.).
- **groupeController.js** - Gestion des groupes (création, mise à jour, suppression, etc.).
- **transactionController.js** - Gestion des transactions (création, mise à jour, suppression, etc.).

#### `/src/middleware` et `/src/middlewares`
Contient les middlewares pour l'authentification, la validation, etc.
- Middleware d'authentification pour protéger les routes.
- Middleware de validation pour valider les entrées utilisateur.

#### `/src/models`
Définit les schémas et modèles Mongoose pour la base de données.
- **User.js** - Modèle pour les utilisateurs avec champs comme nom, email, mot de passe, etc.
- **Cotisation.js** - Modèle pour les cotisations avec champs comme montant, date, statut, etc.
- **Groupe.js** - Modèle pour les groupes avec champs comme nom, description, membres, etc.
- **Transaction.js** - Modèle pour les transactions avec champs comme montant, date, type, etc.

#### `/src/routes`
Définit les routes de l'API.
- **auth.js** - Routes pour l'authentification (/api/auth/register, /api/auth/login, etc.).
- **cotisations.js** - Routes pour les cotisations (/api/cotisations).
- **groupes.js** - Routes pour les groupes (/api/groupes).
- **transactions.js** - Routes pour les transactions (/api/transactions).

#### `/src/utils`
Contient des utilitaires et fonctions d'aide.
- Fonctions pour générer des tokens JWT.
- Fonctions pour formater les réponses API.
- Autres utilitaires.

## Technologies Utilisées
- **Node.js** - Environnement d'exécution JavaScript côté serveur.
- **Express** - Framework web pour Node.js.
- **MongoDB** - Base de données NoSQL.
- **Mongoose** - ODM (Object Data Modeling) pour MongoDB.
- **Redis** - Stockage en cache pour améliorer les performances.
- **JWT** - JSON Web Tokens pour l'authentification.
- **bcryptjs** - Hachage des mots de passe.
- **express-validator** - Validation des entrées.
- **helmet** - Sécurité HTTP.
- **cors** - Cross-Origin Resource Sharing.
- **morgan** - Logging HTTP.
- **dotenv** - Gestion des variables d'environnement.

## Configuration
1. Créez un fichier `.env` à la racine du projet avec les variables suivantes:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=votre_uri_mongodb
   JWT_SECRET=votre_secret_jwt
   JWT_EXPIRE=30d
   REDIS_URL=redis://localhost:6379
   ```

## Installation
```bash
# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev

# Démarrer en mode production
npm start
```

## Sécurité
L'API implémente plusieurs mesures de sécurité:
- Hachage des mots de passe avec bcryptjs.
- Authentification par JWT.
- Protection contre les attaques CSRF et XSS avec Helmet.
- Limitation de débit (rate limiting) pour prévenir les attaques par force brute.
- Validation des entrées avec express-validator.

## Endpoints API

### Authentification
- `POST /api/auth/register` - Inscription d'un nouvel utilisateur.
- `POST /api/auth/login` - Connexion d'un utilisateur.
- `GET /api/auth/me` - Récupérer les informations de l'utilisateur connecté.

### Cotisations
- `GET /api/cotisations` - Récupérer toutes les cotisations.
- `POST /api/cotisations` - Créer une nouvelle cotisation.
- `GET /api/cotisations/:id` - Récupérer une cotisation spécifique.
- `PUT /api/cotisations/:id` - Mettre à jour une cotisation.
- `DELETE /api/cotisations/:id` - Supprimer une cotisation.

### Groupes
- `GET /api/groupes` - Récupérer tous les groupes.
- `POST /api/groupes` - Créer un nouveau groupe.
- `GET /api/groupes/:id` - Récupérer un groupe spécifique.
- `PUT /api/groupes/:id` - Mettre à jour un groupe.
- `DELETE /api/groupes/:id` - Supprimer un groupe.

### Transactions
- `GET /api/transactions` - Récupérer toutes les transactions.
- `POST /api/transactions` - Créer une nouvelle transaction.
- `GET /api/transactions/:id` - Récupérer une transaction spécifique.
- `PUT /api/transactions/:id` - Mettre à jour une transaction.
- `DELETE /api/transactions/:id` - Supprimer une transaction.


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
