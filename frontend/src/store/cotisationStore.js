import { create } from 'zustand';

const useCotisationStore = create((set) => ({
  cotisations: [],
  isLoading: false,
  error: null,
  
  // Action pour définir les cotisations
  setCotisations: (cotisations) => set({ cotisations }),
  
  // Action pour ajouter une cotisation
  addCotisation: (cotisation) => set((state) => ({ 
    cotisations: [...state.cotisations, cotisation] 
  })),
  
  // Action pour mettre à jour une cotisation
  updateCotisation: (id, updatedCotisation) => set((state) => ({
    cotisations: state.cotisations.map((cotisation) => 
      cotisation._id === id ? { ...cotisation, ...updatedCotisation } : cotisation
    )
  })),
  
  // Action pour supprimer une cotisation
  deleteCotisation: (id) => set((state) => ({
    cotisations: state.cotisations.filter((cotisation) => cotisation._id !== id)
  })),
  
  // Action pour définir l'état de chargement
  setLoading: (isLoading) => set({ isLoading }),
  
  // Action pour définir une erreur
  setError: (error) => set({ error }),
}));

export default useCotisationStore;
