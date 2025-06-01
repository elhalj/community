import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTransactions } from '../hooks/useTransactions';
import { useGroupes } from '../hooks/useGroupes';
import useAuthStore from '../store/authStore';
import { toast } from 'react-toastify';
import { FaSpinner, FaArrowLeft, FaSave } from 'react-icons/fa';

const TransactionForm = () => {
  const { groupeId, transactionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getTransactionById, createTransaction, updateTransaction } = useTransactions();
  const { getGroupeById } = useGroupes();
  const isEditing = !!transactionId;

  // État du formulaire
  const [formData, setFormData] = useState({
    type: 'Entrée',
    montant: '',
    description: '',
    categorie: '',
    date: new Date().toISOString().split('T')[0],
    membreConcerne: '',
    groupeConcerne: groupeId,
    pieceJustificative: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Récupérer les détails du groupe
  const { data: groupeData } = getGroupeById(groupeId);

  // Récupérer les données de la transaction si en mode édition
  const { 
    data: transactionData, 
    isLoading: isLoadingTransaction, 
    isError: isErrorTransaction, 
    error: errorTransaction 
  } = getTransactionById(transactionId);

  // Remplir le formulaire avec les données de la transaction si en mode édition
  useEffect(() => {
    if (isEditing && transactionData?.data) {
      const transaction = transactionData.data;
      setFormData({
        type: transaction.type || 'Entrée',
        montant: transaction.montant || '',
        description: transaction.description || '',
        categorie: transaction.categorie || '',
        date: transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        membreConcerne: transaction.membreConcerne?._id || '',
        groupeConcerne: transaction.groupeConcerne?._id || groupeId,
        pieceJustificative: transaction.pieceJustificative || ''
      });
    }
  }, [isEditing, transactionData, groupeId]);

  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Effacer l'erreur lorsque l'utilisateur modifie le champ
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Valider le formulaire
  const validateForm = () => {
    const newErrors = {};
    if (!formData.type) {
      newErrors.type = 'Le type de transaction est requis';
    }
    if (!formData.montant || formData.montant <= 0) {
      newErrors.montant = 'Le montant doit être supérieur à 0';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }
    if (!formData.categorie.trim()) {
      newErrors.categorie = 'La catégorie est requise';
    }
    if (!formData.date) {
      newErrors.date = 'La date est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (isEditing) {
        await updateTransaction.mutateAsync({
          id: transactionId,
          transactionData: formData
        });
        toast.success('Transaction mise à jour avec succès');
      } else {
        await createTransaction.mutateAsync(formData);
        toast.success('Transaction créée avec succès');
      }
      
      // Rediriger vers la page des transactions du groupe
      navigate(`/groupes/${groupeId}/transactions`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Afficher un message de chargement en mode édition
  if (isEditing && isLoadingTransaction) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-blue-600 text-4xl" />
      </div>
    );
  }

  // Afficher un message d'erreur en mode édition
  if (isEditing && isErrorTransaction) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
        <p>Erreur: {errorTransaction.message || 'Impossible de charger les données de la transaction'}</p>
        <Link to={`/groupes/${groupeId}/transactions`} className="text-blue-600 hover:underline mt-2 inline-block">
          Retour aux transactions
        </Link>
      </div>
    );
  }

  // Catégories prédéfinies pour les transactions
  const categoriesOptions = [
    'Cotisation mensuelle',
    'Don',
    'Événement',
    'Frais administratifs',
    'Matériel',
    'Projet',
    'Remboursement',
    'Autre'
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link to={`/groupes/${groupeId}/transactions`} className="text-blue-600 hover:underline flex items-center">
          <FaArrowLeft className="mr-2" /> Retour aux transactions
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {isEditing ? 'Modifier la transaction' : 'Nouvelle transaction'}
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="mb-4">
                <label htmlFor="type" className="block text-gray-700 font-medium mb-2">
                  Type de transaction *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.type ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="Entrée">Entrée</option>
                  <option value="Sortie">Sortie</option>
                </select>
                {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="montant" className="block text-gray-700 font-medium mb-2">
                  Montant (FCFA) *
                </label>
                <input
                  type="number"
                  id="montant"
                  name="montant"
                  value={formData.montant}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.montant ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.montant && <p className="text-red-500 text-sm mt-1">{errors.montant}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="categorie" className="block text-gray-700 font-medium mb-2">
                  Catégorie *
                </label>
                <select
                  id="categorie"
                  name="categorie"
                  value={formData.categorie}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.categorie ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categoriesOptions.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.categorie && <p className="text-red-500 text-sm mt-1">{errors.categorie}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Décrivez la transaction"
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="pieceJustificative" className="block text-gray-700 font-medium mb-2">
                Pièce justificative (URL)
              </label>
              <input
                type="text"
                id="pieceJustificative"
                name="pieceJustificative"
                value={formData.pieceJustificative}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="URL de la pièce justificative (optionnel)"
              />
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center disabled:bg-blue-400"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" /> Traitement...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" /> {isEditing ? 'Mettre à jour' : 'Enregistrer'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;
