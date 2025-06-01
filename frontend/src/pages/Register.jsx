import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';

// Schéma de validation
const schema = yup.object({
  nom: yup
    .string()
    .required('Le nom est requis')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  prenom: yup
    .string()
    .required('Le prénom est requis')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères'),
  email: yup
    .string()
    .email('Veuillez entrer un email valide')
    .required('L\'email est requis'),
  telephone: yup
    .string()
    .required('Le numéro de téléphone est requis')
    .matches(/^[0-9]{10,15}$/, 'Veuillez entrer un numéro de téléphone valide'),
  adresse: yup
    .string()
    .required('L\'adresse est requise'),
  password: yup
    .string()
    .required('Le mot de passe est requis')
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Les mots de passe doivent correspondre')
    .required('La confirmation du mot de passe est requise'),
}).required();

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Supprimer la confirmation du mot de passe avant l'envoi
      const { confirmPassword, ...userData } = data;
      await registerUser.mutateAsync(userData);
      toast.success('Inscription réussie!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">Créer un compte</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="nom" className="block text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              id="nom"
              {...register('nom')}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.nom ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Votre nom"
            />
            {errors.nom && (
              <p className="text-red-500 text-sm mt-1">{errors.nom.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="prenom" className="block text-gray-700 mb-1">Prénom</label>
            <input
              type="text"
              id="prenom"
              {...register('prenom')}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.prenom ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Votre prénom"
            />
            {errors.prenom && (
              <p className="text-red-500 text-sm mt-1">{errors.prenom.message}</p>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            id="email"
            {...register('email')}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Votre email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="telephone" className="block text-gray-700 mb-1">Téléphone</label>
          <input
            type="tel"
            id="telephone"
            {...register('telephone')}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.telephone ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Votre numéro de téléphone"
          />
          {errors.telephone && (
            <p className="text-red-500 text-sm mt-1">{errors.telephone.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="adresse" className="block text-gray-700 mb-1">Adresse</label>
          <input
            type="text"
            id="adresse"
            {...register('adresse')}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.adresse ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Votre adresse"
          />
          {errors.adresse && (
            <p className="text-red-500 text-sm mt-1">{errors.adresse.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="password" className="block text-gray-700 mb-1">Mot de passe</label>
          <input
            type="password"
            id="password"
            {...register('password')}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Votre mot de passe"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-gray-700 mb-1">Confirmer le mot de passe</label>
          <input
            type="password"
            id="confirmPassword"
            {...register('confirmPassword')}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Confirmez votre mot de passe"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Vous avez déjà un compte?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
