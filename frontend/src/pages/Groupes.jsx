import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGroupes } from '../hooks/useGroupes';
import useAuthStore from '../store/authStore';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaUsers, FaSpinner } from 'react-icons/fa';

const Groupes = () => {
  const { user } = useAuthStore();
  const { getAllGroupes, getGroupesByMembre, deleteGroupe } = useGroupes();
  const isAdmin = user?.role === 'admin';
  
  // Récupérer les groupes selon le rôle de l'utilisateur
  const { 
    data: groupesData, 
    isLoading, 
    isError, 
    error 
  } = isAdmin ? getAllGroupes : getGroupesByMembre(user?._id);

  // État pour la confirmation de suppression
  const [deleteId, setDeleteId] = useState(null);

  // Gérer la suppression d'un groupe
  const handleDelete = async (id) => {
    try {
      await deleteGroupe.mutateAsync(id);
      toast.success('Groupe supprimé avec succès');
      setDeleteId(null);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur lors de la suppression du groupe');
    }
  };

  // Afficher un message de chargement
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-blue-600 text-4xl" />
      </div>
    );
  }

  // Afficher un message d'erreur
  if (isError) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
        <p>Erreur: {error.message || 'Impossible de charger les groupes'}</p>
      </div>
    );
  }

  // Récupérer les groupes
  const groupes = groupesData?.data || [];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Groupes</h1>
        {isAdmin && (
          <Link
            to="/groupes/nouveau"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <FaPlus className="mr-2" /> Créer un groupe
          </Link>
        )}
      </div>

      {groupes.length === 0 ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-yellow-800">
            {isAdmin
              ? "Aucun groupe n'a été créé. Créez votre premier groupe !"
              : "Vous n'êtes membre d'aucun groupe pour le moment."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupes.map((groupe) => (
            <div
              key={groupe._id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{groupe.nom}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{groupe.description}</p>
                <div className="mb-4">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Cotisation mensuelle:</span>{' '}
                    {groupe.montantCotisationMensuelle.toLocaleString()} FCFA
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Membres:</span> {groupe.membres?.length || 0}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Créé le:</span>{' '}
                    {new Date(groupe.dateCreation).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/groupes/${groupe._id}`}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200 transition-colors text-sm"
                  >
                    Détails
                  </Link>
                  <Link
                    to={`/groupes/${groupe._id}/membres`}
                    className="bg-green-100 text-green-700 px-3 py-1 rounded-md hover:bg-green-200 transition-colors text-sm flex items-center"
                  >
                    <FaUsers className="mr-1" /> Membres
                  </Link>
                  {(isAdmin || groupe.responsable === user?._id) && (
                    <>
                      <Link
                        to={`/groupes/${groupe._id}/modifier`}
                        className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-md hover:bg-yellow-200 transition-colors text-sm flex items-center"
                      >
                        <FaEdit className="mr-1" /> Modifier
                      </Link>
                      {deleteId === groupe._id ? (
                        <div className="flex gap-1 mt-2">
                          <button
                            onClick={() => handleDelete(groupe._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors text-sm"
                          >
                            Confirmer
                          </button>
                          <button
                            onClick={() => setDeleteId(null)}
                            className="bg-gray-300 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-400 transition-colors text-sm"
                          >
                            Annuler
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteId(groupe._id)}
                          className="bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 transition-colors text-sm flex items-center"
                        >
                          <FaTrash className="mr-1" /> Supprimer
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Groupes;
