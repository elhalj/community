import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import cotisationService from '../services/cotisationService';
import useCotisationStore from '../store/cotisationStore';

// Hook personnalisé pour gérer les cotisations avec React Query
export const useCotisations = () => {
  const queryClient = useQueryClient();
  const { setLoading, setError } = useCotisationStore();

  // Récupérer toutes les cotisations
  const getAllCotisations = () => {
    return useQuery({
      queryKey: ['cotisations'],
      queryFn: async () => {
        setLoading(true);
        try {
          const data = await cotisationService.getAllCotisations();
          setLoading(false);
          return data.data;
        } catch (error) {
          setError(error.response?.data?.message || 'Erreur lors de la récupération des cotisations');
          setLoading(false);
          throw error;
        }
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Récupérer les cotisations d'un membre
  const getCotisationsByMembre = (membreId) => {
    return useQuery({
      queryKey: ['cotisations', 'membre', membreId],
      queryFn: async () => {
        setLoading(true);
        try {
          const data = await cotisationService.getCotisationsByMembre(membreId);
          setLoading(false);
          return data.data;
        } catch (error) {
          setError(error.response?.data?.message || 'Erreur lors de la récupération des cotisations');
          setLoading(false);
          throw error;
        }
      },
      enabled: !!membreId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Récupérer les cotisations par période
  const getCotisationsByPeriode = (mois, annee) => {
    return useQuery({
      queryKey: ['cotisations', 'periode', mois, annee],
      queryFn: async () => {
        setLoading(true);
        try {
          const data = await cotisationService.getCotisationsByPeriode(mois, annee);
          setLoading(false);
          return data.data;
        } catch (error) {
          setError(error.response?.data?.message || 'Erreur lors de la récupération des cotisations');
          setLoading(false);
          throw error;
        }
      },
      enabled: !!mois && !!annee,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Récupérer une cotisation spécifique
  const getCotisationById = (id) => {
    return useQuery({
      queryKey: ['cotisations', id],
      queryFn: async () => {
        setLoading(true);
        try {
          const data = await cotisationService.getCotisationById(id);
          setLoading(false);
          return data.data;
        } catch (error) {
          setError(error.response?.data?.message || 'Erreur lors de la récupération de la cotisation');
          setLoading(false);
          throw error;
        }
      },
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Créer une cotisation
  const createCotisation = () => {
    return useMutation({
      mutationFn: (cotisationData) => cotisationService.createCotisation(cotisationData),
      onSuccess: () => {
        // Invalider et refetch les queries après création
        queryClient.invalidateQueries({ queryKey: ['cotisations'] });
      },
    });
  };

  // Mettre à jour une cotisation
  const updateCotisation = () => {
    return useMutation({
      mutationFn: ({ id, ...cotisationData }) => cotisationService.updateCotisation(id, cotisationData),
      onSuccess: (_, variables) => {
        // Invalider et refetch les queries spécifiques après mise à jour
        queryClient.invalidateQueries({ queryKey: ['cotisations', variables.id] });
        queryClient.invalidateQueries({ queryKey: ['cotisations'] });
      },
    });
  };
  
  // Mettre à jour le statut d'une cotisation
  const updateCotisationStatus = useMutation({
    mutationFn: ({ id, statut }) => cotisationService.updateCotisationStatus(id, statut),
    onSuccess: (_, variables) => {
      // Invalider et refetch les queries spécifiques après mise à jour du statut
      queryClient.invalidateQueries({ queryKey: ['cotisations', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['cotisations'] });
    },
  });

  // Supprimer une cotisation
  const deleteCotisation = () => {
    return useMutation({
      mutationFn: (id) => cotisationService.deleteCotisation(id),
      onSuccess: () => {
        // Invalider et refetch les queries après suppression
        queryClient.invalidateQueries({ queryKey: ['cotisations'] });
      },
    });
  };

  return {
    getAllCotisations,
    getCotisationsByMembre,
    getCotisationsByPeriode,
    getCotisationById,
    createCotisation,
    updateCotisation,
    updateCotisationStatus,
    deleteCotisation,
  };
};
