import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Action pour définir l'utilisateur et le token après connexion
      login: (userData) =>
        set({
          user: userData,
          // token: token,
          isAuthenticated: true,
        }),

      // Action pour déconnecter l'utilisateur
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),

      // Action pour mettre à jour les informations de l'utilisateur
      updateUser: (userData) =>
        set((state) => ({
          user: { ...state.user, ...userData },
        })),
    }),
    {
      name: "auth-storage", // nom utilisé pour le stockage local
      getStorage: () => localStorage, // utiliser localStorage
    }
  )
);

export default useAuthStore;
