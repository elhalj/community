import { useMutation, useQuery } from "@tanstack/react-query";
import authService from "../services/authService";
import useAuthStore from "../store/authStore";

// Hook personnalisé pour gérer l'authentification avec React Query
export const useAuth = () => {
  const {
    login: storeLogin,
    logout: storeLogout,
    updateUser,
    isAuthenticated,
    user,
  } = useAuthStore();

  // Connexion d'un utilisateur
  const login = useMutation({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: (data) => {
      storeLogin(data.data);
    },
  });

  // Inscription d'un utilisateur
  const register = useMutation({
    mutationFn: (userData) => authService.register(userData),
    onSuccess: (data) => {
      storeLogin(data.data);
    },
  });

  // Déconnexion d'un utilisateur
  const logout = () => {
    storeLogout();
  };

  // Récupérer le profil de l'utilisateur
  const getProfile = useQuery({
    queryKey: ["profile"],
    queryFn: () => authService.getProfile(),
    onSuccess: (data) => {
      updateUser(data.data);
      useAuthStore.setState({ isAuthenticated: true });
    },
    enabled: isAuthenticated, // Activer seulement si l'utilisateur est connecté
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Mettre à jour le profil
  const updateProfile = useMutation({
    mutationFn: (userData) => authService.updateProfile(userData),
    onSuccess: (data) => {
      updateUser(data.data);
    },
  });

  // Mettre à jour le mot de passe
  const updatePassword = useMutation({
    mutationFn: (passwordData) => authService.updatePassword(passwordData),
  });

  // Demander la réinitialisation du mot de passe
  const forgotPassword = useMutation({
    mutationFn: (email) => authService.forgotPassword(email),
  });

  // Réinitialiser le mot de passe
  const resetPassword = useMutation({
    mutationFn: ({ token, password }) =>
      authService.resetPassword(token, password),
  });

  return {
    login,
    register,
    logout,
    getProfile,
    updateProfile,
    updatePassword,
    forgotPassword,
    resetPassword,
    isAuthenticated,
    user,
  };
};
