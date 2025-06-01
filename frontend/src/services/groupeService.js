import api from './api';

// Service pour gérer les appels API liés aux groupes
const groupeService = {
  // Récupérer tous les groupes
  getAllGroupes: async () => {
    const response = await api.get('/api/groupes');
    return response.data;
  },

  // Récupérer les groupes d'un membre
  getGroupesByMembre: async (membreId) => {
    const response = await api.get(`/api/groupes/membre/${membreId}`);
    return response.data;
  },

  // Récupérer un groupe par ID
  getGroupeById: async (id) => {
    const response = await api.get(`/api/groupes/${id}`);
    return response.data;
  },

  // Créer un nouveau groupe
  createGroupe: async (groupeData) => {
    const response = await api.post('/api/groupes', groupeData);
    return response.data;
  },

  // Mettre à jour un groupe
  updateGroupe: async (id, groupeData) => {
    const response = await api.put(`/api/groupes/${id}`, groupeData);
    return response.data;
  },

  // Supprimer un groupe
  deleteGroupe: async (id) => {
    const response = await api.delete(`/api/groupes/${id}`);
    return response.data;
  },

  // Ajouter un membre à un groupe
  addMembreToGroupe: async (groupeId, userId) => {
    const response = await api.put(`/api/groupes/${groupeId}/membres/${userId}`);
    return response.data;
  },

  // Retirer un membre d'un groupe
  removeMembreFromGroupe: async (groupeId, userId) => {
    const response = await api.delete(`/api/groupes/${groupeId}/membres/${userId}`);
    return response.data;
  }
};

export default groupeService;
