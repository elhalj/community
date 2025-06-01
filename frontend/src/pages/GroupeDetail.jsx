import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGroupes } from '../hooks/useGroupes';
import { useTransactions } from '../hooks/useTransactions';
import useAuthStore from '../store/authStore';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaUsers, FaSpinner, FaArrowLeft, FaMoneyBillWave } from 'react-icons/fa';

const GroupeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getGroupeById, deleteGroupe } = useGroupes();
  const { getTransactionsByGroupe } = useTransactions();
  const isAdmin = user?.role === 'admin';
  
  // Récupérer les détails du groupe
  const { 
    data: groupeData, 
    isLoading: isLoadingGroupe, 
    isError: isErrorGroupe, 
    error: errorGroupe 
  } = getGroupeById(id);

  // Récupérer les transactions du groupe
  const {
    data: transactionsData,
    isLoading: isLoadingTransactions
  } = getTransactionsByGroupe(id);

  // État pour la confirmation de suppression
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Gérer la suppression d'un groupe
  const handleDelete = async () => {
    try {
      await deleteGroupe.mutateAsync(id);
      toast.success('Groupe supprimé avec succès');
      navigate('/groupes');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur lors de la suppression du groupe');
    }
  };

  // Afficher un message de chargement
  if (isLoadingGroupe) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-blue-600 text-4xl" />
      </div>
    );
  }

  // Afficher un message d'erreur
  if (isErrorGroupe) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
        <p>Erreur: {errorGroupe.message || 'Impossible de charger les détails du groupe'}</p>
        <Link to="/groupes" className="text-blue-600 hover:underline mt-2 inline-block">
          Retour à la liste des groupes
        </Link>
      </div>
    );
  }

  const groupe = groupeData?.data;
  const transactions = transactionsData?.data || [];
  const isResponsable = groupe?.responsable?._id === user?._id;
  const canEdit = isAdmin || isResponsable;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link to="/groupes" className="text-blue-600 hover:underline flex items-center">
          <FaArrowLeft className="mr-2" /> Retour aux groupes
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-8">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-gray-800">{groupe.nom}</h1>
            {canEdit && (
              <div className="flex gap-2">
                <Link
                  to={`/groupes/${groupe._id}/modifier`}
                  className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-md hover:bg-yellow-200 transition-colors text-sm flex items-center"
                >
                  <FaEdit className="mr-1" /> Modifier
                </Link>
                {showDeleteConfirm ? (
                  <div className="flex gap-1">
                    <button
                      onClick={handleDelete}
                      className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors text-sm"
                    >
                      Confirmer
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="bg-gray-300 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-400 transition-colors text-sm"
                    >
                      Annuler
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 transition-colors text-sm flex items-center"
                  >
                    <FaTrash className="mr-1" /> Supprimer
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="mb-6">
            <p className="text-gray-600 mb-4">{groupe.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-semibold text-gray-700 mb-2">Informations générales</h3>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Cotisation mensuelle:</span>{' '}
                  {groupe.montantCotisationMensuelle.toLocaleString()} FCFA
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Date de création:</span>{' '}
                  {new Date(groupe.dateCreation).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Statut:</span>{' '}
                  <span className={`${groupe.actif ? 'text-green-600' : 'text-red-600'}`}>
                    {groupe.actif ? 'Actif' : 'Inactif'}
                  </span>
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-semibold text-gray-700 mb-2">Responsable</h3>
                {groupe.responsable ? (
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Nom:</span>{' '}
                      {groupe.responsable.nom} {groupe.responsable.prenom}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Email:</span> {groupe.responsable.email}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Information non disponible</p>
                )}
              </div>
            </div>
          </div>

          {groupe.reglementation && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">Règlementation</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600">{groupe.reglementation}</p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 mt-4">
            <Link
              to={`/groupes/${groupe._id}/membres`}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <FaUsers className="mr-2" /> Gérer les membres ({groupe.membres?.length || 0})
            </Link>
            <Link
              to={`/groupes/${groupe._id}/transactions`}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
            >
              <FaMoneyBillWave className="mr-2" /> Voir les transactions
            </Link>
          </div>
        </div>
      </div>

      {/* Section des transactions récentes */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Transactions récentes</h2>
          
          {isLoadingTransactions ? (
            <div className="flex justify-center items-center h-20">
              <FaSpinner className="animate-spin text-blue-600 text-2xl" />
            </div>
          ) : transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.slice(0, 5).map((transaction) => (
                    <tr key={transaction._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            transaction.type === 'Entrée'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.montant.toLocaleString()} FCFA
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {transactions.length > 5 && (
                <div className="mt-4 text-center">
                  <Link
                    to={`/groupes/${groupe._id}/transactions`}
                    className="text-blue-600 hover:underline"
                  >
                    Voir toutes les transactions
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Aucune transaction pour ce groupe.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupeDetail;
