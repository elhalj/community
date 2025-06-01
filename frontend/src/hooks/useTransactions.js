import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import transactionService from '../services/transactionService';

// Hook personnalisé pour gérer les transactions avec React Query
export const useTransactions = () => {
  const queryClient = useQueryClient();

  // Récupérer toutes les transactions (admin uniquement)
  const getAllTransactions = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionService.getAllTransactions(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Récupérer les transactions d'un membre
  const getTransactionsByMembre = (membreId) => useQuery({
    queryKey: ['transactions', 'membre', membreId],
    queryFn: () => transactionService.getTransactionsByMembre(membreId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!membreId,
  });

  // Récupérer les transactions d'un groupe
  const getTransactionsByGroupe = (groupeId) => useQuery({
    queryKey: ['transactions', 'groupe', groupeId],
    queryFn: () => transactionService.getTransactionsByGroupe(groupeId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!groupeId,
  });

  // Récupérer une transaction par ID
  const getTransactionById = (id) => useQuery({
    queryKey: ['transactions', id],
    queryFn: () => transactionService.getTransactionById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id,
  });

  // Créer une nouvelle transaction
  const createTransaction = useMutation({
    mutationFn: (transactionData) => transactionService.createTransaction(transactionData),
    onSuccess: () => {
      // Invalider les requêtes pour forcer un rafraîchissement des données
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions', 'membre'] });
      queryClient.invalidateQueries({ queryKey: ['transactions', 'groupe'] });
    },
  });

  // Mettre à jour une transaction
  const updateTransaction = useMutation({
    mutationFn: ({ id, transactionData }) => transactionService.updateTransaction(id, transactionData),
    onSuccess: (data, variables) => {
      // Invalider les requêtes pour forcer un rafraîchissement des données
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['transactions', 'membre'] });
      queryClient.invalidateQueries({ queryKey: ['transactions', 'groupe'] });
    },
  });

  // Supprimer une transaction
  const deleteTransaction = useMutation({
    mutationFn: (id) => transactionService.deleteTransaction(id),
    onSuccess: () => {
      // Invalider les requêtes pour forcer un rafraîchissement des données
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions', 'membre'] });
      queryClient.invalidateQueries({ queryKey: ['transactions', 'groupe'] });
    },
  });

  // Générer un rapport financier
  const generateFinancialReport = useMutation({
    mutationFn: (reportData) => transactionService.generateFinancialReport(reportData),
  });

  return {
    getAllTransactions,
    getTransactionsByMembre,
    getTransactionsByGroupe,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    generateFinancialReport,
  };
};
