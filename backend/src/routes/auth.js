const express = require('express');
const { check } = require('express-validator');
const {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');

const router = express.Router();

// Middleware de protection des routes
const { protect } = require('../middleware/auth');

// Validation pour l'inscription
const registerValidation = [
  check('nom', 'Le nom est requis').not().isEmpty(),
  check('prenom', 'Le prénom est requis').not().isEmpty(),
  check('email', 'Veuillez inclure un email valide').isEmail(),
  check('password', 'Le mot de passe doit contenir au moins 6 caractères').isLength({ min: 6 }),
  check('telephone', 'Le numéro de téléphone est requis').not().isEmpty(),
  check('adresse', 'L\'adresse est requise').not().isEmpty()
];

// Validation pour la connexion
const loginValidation = [
  check('email', 'Veuillez inclure un email valide').isEmail(),
  check('password', 'Le mot de passe est requis').exists()
];

// Validation pour la mise à jour des détails
const updateDetailsValidation = [
  check('nom', 'Le nom est requis').not().isEmpty(),
  check('prenom', 'Le prénom est requis').not().isEmpty(),
  check('telephone', 'Le numéro de téléphone est requis').not().isEmpty(),
  check('adresse', 'L\'adresse est requise').not().isEmpty()
];

// Validation pour la mise à jour du mot de passe
const updatePasswordValidation = [
  check('currentPassword', 'Le mot de passe actuel est requis').not().isEmpty(),
  check('newPassword', 'Le nouveau mot de passe doit contenir au moins 6 caractères').isLength({ min: 6 })
];

// Routes publiques
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

// Routes protégées
router.get('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetailsValidation, updateDetails);
router.put('/updatepassword', protect, updatePasswordValidation, updatePassword);

module.exports = router;
