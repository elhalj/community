const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createClient } = require('redis');
const connectDB = require('./src/config/db');

// Charger les variables d'environnement
dotenv.config();

// Connexion à la base de données
connectDB();

// Initialiser l'application Express
const app = express();

// Middleware pour le parsing du body
app.use(express.json());

// Middleware pour les logs en développement
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Sécurité
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // limite chaque IP à 100 requêtes par fenêtre
});
app.use(limiter);

// Initialiser Redis pour le cache
let redisClient;
(async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL
    });

    redisClient.on('error', (error) => {
      console.error(`Redis Error: ${error}`);
    });

    await redisClient.connect();
    console.log('Redis client connected');
  } catch (error) {
    console.error(`Redis connection error: ${error}`);
  }
})();

// Route de base
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API de Seguikro - Application de Cotisation Mensuelle' });
});

// Définir le port
const PORT = process.env.PORT || 5000;

// Démarrer le serveur
const server = app.listen(PORT, () => {
  console.log(`Serveur démarré en mode ${process.env.NODE_ENV} sur le port ${PORT}`);
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', (err, promise) => {
  console.log(`Erreur: ${err.message}`);
  // Fermer le serveur et quitter le processus
  server.close(() => process.exit(1));
});
