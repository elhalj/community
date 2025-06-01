import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import useAuthStore from '../store/authStore';
import { useAuth } from '../hooks/useAuth';

// Schéma de validation pour la mise à jour du profil
const profileSchema = yup.object({
  nom: yup
    .string()
    .required('Le nom est requis')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  prenom: yup
    .string()
    .required('Le prénom est requis')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères'),
  telephone: yup
    .string()
    .required('Le numéro de téléphone est requis')
    .matches(/^[0-9]{10,15}$/, 'Veuillez entrer un numéro de téléphone valide'),
  adresse: yup
    .string()
    .required('L\'adresse est requise'),
}).required();

// Schéma de validation pour la mise à jour du mot de passe
const passwordSchema = yup.object({
  currentPassword: yup
    .string()
    .required('Le mot de passe actuel est requis'),
  newPassword: yup
    .string()
    .required('Le nouveau mot de passe est requis')
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Les mots de passe doivent correspondre')
    .required('La confirmation du mot de passe est requise'),
}).required();

const Profile = () => {
  const { user } = useAuthStore();
  const { updateProfile, updatePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  // Formulaire pour la mise à jour du profil
  const { 
    register: registerProfile, 
    handleSubmit: handleSubmitProfile, 
    formState: { errors: profileErrors } 
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      nom: user?.nom || '',
      prenom: user?.prenom || '',
      telephone: user?.telephone || '',
      adresse: user?.adresse || '',
    },
  });

  // Formulaire pour la mise à jour du mot de passe
  const { 
    register: registerPassword, 
    handleSubmit: handleSubmitPassword, 
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  // Gérer la mise à jour du profil
  const onSubmitProfile = async (data) => {
    try {
      await updateProfile.mutateAsync(data);
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour du profil');
    }
  };

  // Gérer la mise à jour du mot de passe
  const onSubmitPassword = async (data) => {
    try {
      await updatePassword.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Mot de passe mis à jour avec succès');
      resetPassword();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour du mot de passe');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mon Profil</h1>
      
      {/* Onglets */}
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'profile'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('profile')}
        >
          Informations personnelles
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'security'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('security')}
        >
          Sécurité
        </button>
      </div>
      
      {/* Contenu des onglets */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {activeTab === 'profile' ? (
          <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nom" className="block text-gray-700 mb-1">Nom</label>
                <input
                  type="text"
                  id="nom"
                  {...registerProfile('nom')}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${profileErrors.nom ? 'border-red-500' : 'border-gray-300'}`}
                />
                {profileErrors.nom && (
                  <p className="text-red-500 text-sm mt-1">{profileErrors.nom.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="prenom" className="block text-gray-700 mb-1">Prénom</label>
                <input
                  type="text"
                  id="prenom"
                  {...registerProfile('prenom')}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${profileErrors.prenom ? 'border-red-500' : 'border-gray-300'}`}
                />
                {profileErrors.prenom && (
                  <p className="text-red-500 text-sm mt-1">{profileErrors.prenom.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
              <p className="text-sm text-gray-500 mt-1">L'email ne peut pas être modifié</p>
            </div>
            
            <div>
              <label htmlFor="telephone" className="block text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                id="telephone"
                {...registerProfile('telephone')}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${profileErrors.telephone ? 'border-red-500' : 'border-gray-300'}`}
              />
              {profileErrors.telephone && (
                <p className="text-red-500 text-sm mt-1">{profileErrors.telephone.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="adresse" className="block text-gray-700 mb-1">Adresse</label>
              <input
                type="text"
                id="adresse"
                {...registerProfile('adresse')}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${profileErrors.adresse ? 'border-red-500' : 'border-gray-300'}`}
              />
              {profileErrors.adresse && (
                <p className="text-red-500 text-sm mt-1">{profileErrors.adresse.message}</p>
              )}
            </div>
            
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={updateProfile.isLoading}
            >
              {updateProfile.isLoading ? 'Mise à jour...' : 'Mettre à jour le profil'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-gray-700 mb-1">Mot de passe actuel</label>
              <input
                type="password"
                id="currentPassword"
                {...registerPassword('currentPassword')}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300'}`}
              />
              {passwordErrors.currentPassword && (
                <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-gray-700 mb-1">Nouveau mot de passe</label>
              <input
                type="password"
                id="newPassword"
                {...registerPassword('newPassword')}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300'}`}
              />
              {passwordErrors.newPassword && (
                <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-gray-700 mb-1">Confirmer le nouveau mot de passe</label>
              <input
                type="password"
                id="confirmPassword"
                {...registerPassword('confirmPassword')}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
              />
              {passwordErrors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword.message}</p>
              )}
            </div>
            
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={updatePassword.isLoading}
            >
              {updatePassword.isLoading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
