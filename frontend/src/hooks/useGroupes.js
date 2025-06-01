import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import groupeService from '../services/groupeService';

// Hook personnalisé pour gérer les groupes avec React Query
export const useGroupes = () => {
  const queryClient = useQueryClient();

  // Récupérer tous les groupes
  const getAllGroupes = useQuery({
    queryKey: ['groupes'],
    queryFn: () => groupeService.getAllGroupes(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Récupérer les groupes d'un membre
  const getGroupesByMembre = (membreId) => useQuery({
    queryKey: ['groupes', 'membre', membreId],
    queryFn: () => groupeService.getGroupesByMembre(membreId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!membreId,
  });

  // Récupérer un groupe par ID
  const getGroupeById = (id) => useQuery({
    queryKey: ['groupes', id],
    queryFn: () => groupeService.getGroupeById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id,
  });

  // Créer un nouveau groupe
  const createGroupe = useMutation({
    mutationFn: (groupeData) => groupeService.createGroupe(groupeData),
    onSuccess: () => {
      // Invalider les requêtes pour forcer un rafraîchissement des données
      queryClient.invalidateQueries({ queryKey: ['groupes'] });
    },
  });

  // Mettre à jour un groupe
  const updateGroupe = useMutation({
    mutationFn: ({ id, groupeData }) => groupeService.updateGroupe(id, groupeData),
    onSuccess: (data, variables) => {
      // Invalider les requêtes pour forcer un rafraîchissement des données
      queryClient.invalidateQueries({ queryKey: ['groupes'] });
      queryClient.invalidateQueries({ queryKey: ['groupes', variables.id] });
    },
  });

  // Supprimer un groupe
  const deleteGroupe = useMutation({
    mutationFn: (id) => groupeService.deleteGroupe(id),
    onSuccess: () => {
      // Invalider les requêtes pour forcer un rafraîchissement des données
      queryClient.invalidateQueries({ queryKey: ['groupes'] });
    },
  });

  // Ajouter un membre à un groupe
  const addMembreToGroupe = useMutation({
    mutationFn: ({ groupeId, userId }) => groupeService.addMembreToGroupe(groupeId, userId),
    onSuccess: (data, variables) => {
      // Invalider les requêtes pour forcer un rafraîchissement des données
      queryClient.invalidateQueries({ queryKey: ['groupes'] });
      queryClient.invalidateQueries({ queryKey: ['groupes', variables.groupeId] });
      queryClient.invalidateQueries({ queryKey: ['groupes', 'membre'] });
    },
  });

  // Retirer un membre d'un groupe
  const removeMembreFromGroupe = useMutation({
    mutationFn: ({ groupeId, userId }) => groupeService.removeMembreFromGroupe(groupeId, userId),
    onSuccess: (data, variables) => {
      // Invalider les requêtes pour forcer un rafraîchissement des données
      queryClient.invalidateQueries({ queryKey: ['groupes'] });
      queryClient.invalidateQueries({ queryKey: ['groupes', variables.groupeId] });
      queryClient.invalidateQueries({ queryKey: ['groupes', 'membre'] });
    },
  });

  return {
    getAllGroupes,
    getGroupesByMembre,
    getGroupeById,
    createGroupe,
    updateGroupe,
    deleteGroupe,
    addMembreToGroupe,
    removeMembreFromGroupe,
  };
};
