import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGroupes } from '../hooks/useGroupes';
import useAuthStore from '../store/authStore';
import { toast } from 'react-toastify';
import { FaSpinner, FaArrowLeft, FaSave } from 'react-icons/fa';

const GroupeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getGroupeById, createGroupe, updateGroupe } = useGroupes();
  const isEditing = !!id;

  // État du formulaire
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    montantCotisationMensuelle: 0,
    reglementation: '',
    actif: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Récupérer les données du groupe si en mode édition
  const { 
    data: groupeData, 
    isLoading, 
    isError, 
    error 
  } = getGroupeById(id);

  // Remplir le formulaire avec les données du groupe si en mode édition
  useEffect(() => {
    if (isEditing && groupeData?.data) {
      const groupe = groupeData.data;
      setFormData({
        nom: groupe.nom || '',
        description: groupe.description || '',
        montantCotisationMensuelle: groupe.montantCotisationMensuelle || 0,
        reglementation: groupe.reglementation || '',
        actif: groupe.actif !== undefined ? groupe.actif : true
      });
    }
  }, [isEditing, groupeData]);

  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
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
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom du groupe est requis';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }
    if (formData.montantCotisationMensuelle <= 0) {
      newErrors.montantCotisationMensuelle = 'Le montant doit être supérieur à 0';
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
        await updateGroupe.mutateAsync({
          id,
          groupeData: formData
        });
        toast.success('Groupe mis à jour avec succès');
      } else {
        const result = await createGroupe.mutateAsync(formData);
        toast.success('Groupe créé avec succès');
        // Rediriger vers la page de détail du nouveau groupe
        navigate(`/groupes/${result.data._id}`);
        return; // Éviter la redirection ci-dessous
      }
      
      // Rediriger vers la page de détail du groupe
      navigate(`/groupes/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Afficher un message de chargement en mode édition
  if (isEditing && isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-blue-600 text-4xl" />
      </div>
    );
  }

  // Afficher un message d'erreur en mode édition
  if (isEditing && isError) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
        <p>Erreur: {error.message || 'Impossible de charger les données du groupe'}</p>
        <Link to="/groupes" className="text-blue-600 hover:underline mt-2 inline-block">
          Retour à la liste des groupes
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link to="/groupes" className="text-blue-600 hover:underline flex items-center">
          <FaArrowLeft className="mr-2" /> Retour aux groupes
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {isEditing ? 'Modifier le groupe' : 'Créer un nouveau groupe'}
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="nom" className="block text-gray-700 font-medium mb-2">
                Nom du groupe *
              </label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.nom ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Entrez le nom du groupe"
              />
              {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
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
                placeholder="Décrivez le groupe"
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="montantCotisationMensuelle"
                className="block text-gray-700 font-medium mb-2"
              >
                Montant de la cotisation mensuelle (FCFA) *
              </label>
              <input
                type="number"
                id="montantCotisationMensuelle"
                name="montantCotisationMensuelle"
                value={formData.montantCotisationMensuelle}
                onChange={handleChange}
                min="0"
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.montantCotisationMensuelle ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.montantCotisationMensuelle && (
                <p className="text-red-500 text-sm mt-1">{errors.montantCotisationMensuelle}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="reglementation" className="block text-gray-700 font-medium mb-2">
                Règlementation
              </label>
              <textarea
                id="reglementation"
                name="reglementation"
                value={formData.reglementation}
                onChange={handleChange}
                rows="5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Règles et fonctionnement du groupe (optionnel)"
              ></textarea>
            </div>

            <div className="mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="actif"
                  name="actif"
                  checked={formData.actif}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="actif" className="ml-2 block text-gray-700">
                  Groupe actif
                </label>
              </div>
            </div>

            <div className="flex justify-end">
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
                    <FaSave className="mr-2" /> {isEditing ? 'Mettre à jour' : 'Créer'}
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

export default GroupeForm;
