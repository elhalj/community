import api from './api';

// Service pour gérer les appels API liés à l'authentification
const authService = {
  // Inscription d'un nouvel utilisateur
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  // Connexion d'un utilisateur
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  // Récupération du profil de l'utilisateur connecté
  getProfile: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  // Mise à jour du profil de l'utilisateur
  updateProfile: async (userData) => {
    const response = await api.put('/api/auth/updatedetails', userData);
    return response.data;
  },

  // Mise à jour du mot de passe
  updatePassword: async (passwordData) => {
    const response = await api.put('/api/auth/updatepassword', passwordData);
    return response.data;
  },

  // Demande de réinitialisation du mot de passe
  forgotPassword: async (email) => {
    const response = await api.post('/api/auth/forgotpassword', { email });
    return response.data;
  },

  // Réinitialisation du mot de passe avec un token
  resetPassword: async (token, password) => {
    const response = await api.put(`/api/auth/resetpassword/${token}`, { password });
    return response.data;
  },
};

export default authService;
