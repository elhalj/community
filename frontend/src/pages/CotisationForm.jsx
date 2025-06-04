import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useCotisations } from '../hooks/useCotisations';
import useAuthStore from '../store/authStore';

// Schéma de validation
const schema = yup.object({
  mois: yup.string().required('Le mois est requis'),
  annee: yup
    .number()
    .required('L\'année est requise')
    .min(2000, 'L\'année doit être supérieure ou égale à 2000')
    .max(2100, 'L\'année doit être inférieure ou égale à 2100'),
  montant: yup
    .number()
    .required('Le montant est requis')
    .min(1, 'Le montant doit être supérieur à 0'),
  methodePaiement: yup.string().required('La méthode de paiement est requise'),
  referencePaiement: yup.string().when('methodePaiement', (methodePaiement, schema) => {
    return methodePaiement !== 'Espèces'
      ? schema.required('La référence de paiement est requise pour ce mode de paiement')
      : schema;
  }),

  notes: yup.string(),
}).required();

const CotisationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    createCotisation,
    updateCotisation,
    useCotisationById // Correction : Utilisation cohérente du hook
  } = useCotisations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = Boolean(id);

  // Utilisation correcte du hook useCotisationById
  const cotisationQuery = useCotisationById(id); // <-- Correction principale ici

  // Utiliser react-hook-form avec validation yup
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      mois: '',
      annee: new Date().getFullYear(),
      montant: 5000,
      methodePaiement: 'Mobile Money',
      referencePaiement: '',
      notes: '',
    },
  });

  // Surveiller la méthode de paiement pour la validation conditionnelle
  const methodePaiement = watch('methodePaiement');

  // Récupération des détails de la cotisation en mode édition
  useEffect(() => {
    if (isEditMode && cotisationQuery.data) {
      const cotisation = cotisationQuery.data;

      // Vérifier que l'utilisateur est autorisé
      if (user?.role !== 'admin' && cotisation.membre !== user?._id) {
        toast.error('Vous n\'êtes pas autorisé à modifier cette cotisation');
        navigate('/cotisations');
        return;
      }

      // Vérifier le statut
      if (cotisation.statut !== 'En attente') {
        toast.error('Seules les cotisations en attente peuvent être modifiées');
        navigate(`/cotisations/${id}`);
        return;
      }

      // Remplir le formulaire
      reset({
        mois: cotisation.mois,
        annee: cotisation.annee,
        montant: cotisation.montant,
        methodePaiement: cotisation.methodePaiement,
        referencePaiement: cotisation.referencePaiement || '',
        notes: cotisation.notes || '',
      });
    }

    // Gestion des erreurs de récupération
    if (isEditMode && cotisationQuery.isError) {
      toast.error('Erreur lors de la récupération des détails de la cotisation');
      navigate('/cotisations');
    }
  }, [isEditMode, id, cotisationQuery.data, cotisationQuery.isError, reset, navigate, user]);

  // Gérer la soumission du formulaire
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      if (isEditMode) {
        await updateCotisation.mutateAsync({
          id,
          ...data,
        });
        toast.success('Cotisation mise à jour avec succès');
      } else {
        await createCotisation.mutateAsync(data);
        toast.success('Cotisation enregistrée avec succès');
      }

      navigate('/cotisations');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement de la cotisation');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Liste des mois
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  // Générer les années
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  // Méthodes de paiement
  const paymentMethods = ['Mobile Money', 'Virement bancaire', 'Chèque', 'Espèces', 'Carte bancaire'];

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {isEditMode ? 'Modifier la cotisation' : 'Nouvelle cotisation'}
      </h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mois */}
            <div>
              <label htmlFor="mois" className="block text-sm font-medium text-gray-700 mb-1">
                Mois
              </label>
              <select
                id="mois"
                {...register('mois')}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.mois ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Sélectionner un mois</option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              {errors.mois && (
                <p className="text-red-500 text-sm mt-1">{errors.mois.message}</p>
              )}
            </div>

            {/* Année */}
            <div>
              <label htmlFor="annee" className="block text-sm font-medium text-gray-700 mb-1">
                Année
              </label>
              <select
                id="annee"
                {...register('annee')}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.annee ? 'border-red-500' : 'border-gray-300'}`}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              {errors.annee && (
                <p className="text-red-500 text-sm mt-1">{errors.annee.message}</p>
              )}
            </div>
          </div>

          {/* Montant */}
          <div>
            <label htmlFor="montant" className="block text-sm font-medium text-gray-700 mb-1">
              Montant (FCFA)
            </label>
            <input
              type="number"
              id="montant"
              {...register('montant')}
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.montant ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.montant && (
              <p className="text-red-500 text-sm mt-1">{errors.montant.message}</p>
            )}
          </div>

          {/* Méthode de paiement */}
          <div>
            <label htmlFor="methodePaiement" className="block text-sm font-medium text-gray-700 mb-1">
              Méthode de paiement
            </label>
            <select
              id="methodePaiement"
              {...register('methodePaiement')}
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.methodePaiement ? 'border-red-500' : 'border-gray-300'}`}
            >
              {paymentMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
            {errors.methodePaiement && (
              <p className="text-red-500 text-sm mt-1">{errors.methodePaiement.message}</p>
            )}
          </div>

          {/* Référence de paiement (conditionnelle) */}
          {methodePaiement !== 'Espèces' && (
            <div>
              <label htmlFor="referencePaiement" className="block text-sm font-medium text-gray-700 mb-1">
                Référence de paiement
                {methodePaiement === 'Mobile Money' && ' (Numéro de transaction)'}
                {methodePaiement === 'Virement bancaire' && ' (Référence du virement)'}
                {methodePaiement === 'Chèque' && ' (Numéro du chèque)'}
                {methodePaiement === 'Carte bancaire' && ' (Référence de la transaction)'}
              </label>
              <input
                type="text"
                id="referencePaiement"
                {...register('referencePaiement')}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.referencePaiement ? 'border-red-500' : 'border-gray-300'}`}
                placeholder={`Entrez la référence de ${methodePaiement}`}
              />
              {errors.referencePaiement && (
                <p className="text-red-500 text-sm mt-1">{errors.referencePaiement.message}</p>
              )}
            </div>
          )}

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optionnel)
            </label>
            <textarea
              id="notes"
              {...register('notes')}
              rows="3"
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.notes ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Informations complémentaires sur cette cotisation"
            ></textarea>
            {errors.notes && (
              <p className="text-red-500 text-sm mt-1">{errors.notes.message}</p>
            )}
          </div>

          {/* Boutons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/cotisations')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Enregistrement...'
                : isEditMode
                  ? 'Mettre à jour'
                  : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CotisationForm;