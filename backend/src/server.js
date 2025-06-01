const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const path = require("path");

// Charger les variables d'environnement
dotenv.config({ path: "./config/config.env" });

// Connecter à la base de données
connectDB();

// Routes
const auth = require("./routes/auth");
const cotisations = require("./routes/cotisations");
const groupes = require("./routes/groupes");
const transactions = require("./routes/transactions");

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Logger pour le développement
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Activer CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Monter les routes
app.use("/api/auth", auth);
app.use("/api/cotisations", cotisations);
app.use("/api/groupes", groupes);
app.use("/api/transactions", transactions);

// Middleware de gestion des erreurs
app.use(errorHandler);

// Servir les fichiers statiques en production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Serveur en cours d'exécution en mode ${process.env.NODE_ENV} sur le port ${PORT}`
      .yellow.bold
  )
);

// Gérer les rejets de promesse non gérés
process.on("unhandledRejection", (err, promise) => {
  console.log(`Erreur: ${err.message}`.red);
  // Fermer le serveur et quitter le processus
  server.close(() => process.exit(1));
});
