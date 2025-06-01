import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useCotisations } from '../hooks/useCotisations';
import useAuthStore from '../store/authStore';

const CotisationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getCotisationById, updateCotisationStatus, deleteCotisation } = useCotisations();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Récupérer les détails de la cotisation
  const cotisationQuery = getCotisationById(id);

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Fonction pour mettre à jour le statut de la cotisation
  const handleStatusUpdate = async (newStatus) => {
    try {
      setIsUpdatingStatus(true);
      await updateCotisationStatus.mutateAsync({
        id,
        statut: newStatus,
      });
      toast.success(`Statut mis à jour avec succès: ${newStatus}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour du statut');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Fonction pour supprimer la cotisation
  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette cotisation?')) {
      try {
        setIsDeleting(true);
        await deleteCotisation.mutateAsync(id);
        toast.success('Cotisation supprimée avec succès');
        navigate('/cotisations');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Erreur lors de la suppression de la cotisation');
        setIsDeleting(false);
      }
    }
  };

  // Fonction pour obtenir la classe CSS en fonction du statut
  const getStatusClass = (status) => {
    switch (status) {
      case 'Confirmé':
        return 'bg-green-100 text-green-800';
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejeté':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (cotisationQuery.isLoading) {
    return <div className="text-center p-6">Chargement des détails de la cotisation...</div>;
  }

  if (cotisationQuery.isError) {
    return (
      <div className="text-center p-6 text-red-600">
        <p>Erreur lors du chargement des détails de la cotisation</p>
        <Link to="/cotisations" className="text-blue-600 hover:underline mt-4 inline-block">
          Retour à la liste des cotisations
        </Link>
      </div>
    );
  }

  const cotisation = cotisationQuery.data;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Détails de la cotisation</h1>
        <div className="flex space-x-2">
          <Link
            to="/cotisations"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Retour
          </Link>
          {cotisation.statut === 'En attente' && (
            <Link
              to={`/cotisations/${id}/edit`}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Modifier
            </Link>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Informations générales</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Période</p>
                  <p className="font-medium">{cotisation.mois} {cotisation.annee}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Montant</p>
                  <p className="font-medium">{cotisation.montant.toLocaleString()} FCFA</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Statut</p>
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(cotisation.statut)}`}>
                    {cotisation.statut}
                  </span>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Méthode de paiement</p>
                  <p className="font-medium">{cotisation.methodePaiement}</p>
                </div>
                
                {cotisation.referencePaiement && (
                  <div>
                    <p className="text-sm text-gray-500">Référence de paiement</p>
                    <p className="font-medium">{cotisation.referencePaiement}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Détails</h2>
              <div className="space-y-3">
                {user?.role === 'admin' && (
                  <div>
                    <p className="text-sm text-gray-500">Membre</p>
                    <p className="font-medium">
                      {cotisation.membre?.nom} {cotisation.membre?.prenom}
                    </p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-gray-500">Date de paiement</p>
                  <p className="font-medium">{formatDate(cotisation.datePaiement)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Date de création</p>
                  <p className="font-medium">{formatDate(cotisation.createdAt)}</p>
                </div>
                
                {cotisation.updatedAt && cotisation.updatedAt !== cotisation.createdAt && (
                  <div>
                    <p className="text-sm text-gray-500">Dernière mise à jour</p>
                    <p className="font-medium">{formatDate(cotisation.updatedAt)}</p>
                  </div>
                )}
                
                {cotisation.notes && (
                  <div>
                    <p className="text-sm text-gray-500">Notes</p>
                    <p className="font-medium">{cotisation.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions administrateur */}
          {user?.role === 'admin' && cotisation.statut === 'En attente' && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Actions administrateur</h2>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleStatusUpdate('Confirmé')}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                  disabled={isUpdatingStatus}
                >
                  Confirmer la cotisation
                </button>
                <button
                  onClick={() => handleStatusUpdate('Rejeté')}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                  disabled={isUpdatingStatus}
                >
                  Rejeter la cotisation
                </button>
              </div>
            </div>
          )}

          {/* Suppression */}
          {(user?.role === 'admin' || (user?._id === cotisation.membre && cotisation.statut === 'En attente')) && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-red-600">Zone de danger</h2>
              <button
                onClick={handleDelete}
                className="bg-red-100 text-red-700 px-4 py-2 rounded-md hover:bg-red-200 transition-colors disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? 'Suppression...' : 'Supprimer cette cotisation'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CotisationDetail;
