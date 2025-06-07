import api from "./api";

// Service pour gérer les appels API liés aux transactions
const transactionService = {
  // Récupérer toutes les transactions (admin uniquement)
  getAllTransactions: async () => {
    const response = await api.get("/transactions");
    return response.data;
  },

  // Récupérer les transactions d'un membre
  getTransactionsByMembre: async (membreId) => {
    const response = await api.get(`/transactions/membre/${membreId}`);
    return response.data;
  },

  // Récupérer les transactions d'un groupe
  getTransactionsByGroupe: async (groupeId) => {
    const response = await api.get(`/transactions/groupe/${groupeId}`);
    return response.data;
  },

  // Récupérer une transaction par ID
  getTransactionById: async (id) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  // Créer une nouvelle transaction
  createTransaction: async (transactionData) => {
    const response = await api.post("/transactions", transactionData);
    return response.data;
  },

  // Mettre à jour une transaction
  updateTransaction: async (id, transactionData) => {
    const response = await api.put(`/transactions/${id}`, transactionData);
    return response.data;
  },

  // Supprimer une transaction
  deleteTransaction: async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },

  // Générer un rapport financier
  generateFinancialReport: async (reportData) => {
    const response = await api.post("/transactions/report", reportData);
    return response.data;
  },
};

export default transactionService;
