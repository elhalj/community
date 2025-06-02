import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGroupes } from '../hooks/useGroupes';
import useAuthStore from '../store/authStore';
import { toast } from 'react-toastify';
import { FaSpinner, FaArrowLeft, FaUserPlus, FaUserMinus, FaSearch } from 'react-icons/fa';
import api from '../services/api';

const GroupeMembres = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const { getGroupeById, addMembreToGroupe, removeMembreFromGroupe } = useGroupes();
  const addMembreMutation = addMembreToGroupe();
  const removeMembreMutation = removeMembreFromGroupe();
  const isAdmin = user?.role === 'admin';
  
  // États
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Récupérer les détails du groupe
  const { 
    data: groupeData, 
    isLoading, 
    isError, 
    error 
  } = getGroupeById(id);

  const groupe = groupeData?.data;
  const membres = groupe?.membres || [];
  const isResponsable = groupe?.responsable?._id === user?._id;
  const canManageMembers = isAdmin || isResponsable;

  // Rechercher des utilisateurs
  const searchUsers = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await api.get(`/api/auth/users/search?query=${searchTerm}`);
      // Filtrer les utilisateurs qui sont déjà membres du groupe
      const filteredResults = response.data.data.filter(
        (user) => !membres.some((membre) => membre._id === user._id)
      );
      setSearchResults(filteredResults);
    } catch (error) {
      toast.error('Erreur lors de la recherche d\'utilisateurs');
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  // Gérer la recherche
  const handleSearch = (e) => {
    e.preventDefault();
    searchUsers();
  };

  // Ajouter un membre au groupe
  const handleAddMembre = async (userId) => {
    setSelectedUserId(userId);
    setIsProcessing(true);
    
    try {
      await addMembreMutation.mutateAsync({ groupeId: id, userId });
      toast.success('Membre ajouté avec succès');
      setSearchResults([]);
      setSearchTerm('');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur lors de l\'ajout du membre');
    } finally {
      setIsProcessing(false);
      setSelectedUserId(null);
    }
  };

  // Retirer un membre du groupe
  const handleRemoveMembre = async (userId) => {
    setSelectedUserId(userId);
    setIsProcessing(true);
    
    try {
      await removeMembreMutation.mutateAsync({ groupeId: id, userId });
      toast.success('Membre retiré avec succès');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur lors du retrait du membre');
    } finally {
      setIsProcessing(false);
      setSelectedUserId(null);
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
        <p>Erreur: {error.message || 'Impossible de charger les détails du groupe'}</p>
        <Link to="/groupes" className="text-blue-600 hover:underline mt-2 inline-block">
          Retour à la liste des groupes
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link to={`/groupes/${id}`} className="text-blue-600 hover:underline flex items-center">
          <FaArrowLeft className="mr-2" /> Retour au groupe
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-8">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Membres du groupe: {groupe.nom}
          </h1>

          {canManageMembers && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Ajouter un nouveau membre</h2>
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher par nom, prénom ou email..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearching}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center disabled:bg-blue-400"
                >
                  {isSearching ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaSearch />
                  )}
                </button>
              </form>

              {searchResults.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-md font-medium mb-2">Résultats de la recherche</h3>
                  <div className="bg-gray-50 rounded-md p-2">
                    {searchResults.map((result) => (
                      <div
                        key={result._id}
                        className="flex justify-between items-center p-2 border-b border-gray-200 last:border-b-0"
                      >
                        <div>
                          <p className="font-medium">
                            {result.nom} {result.prenom}
                          </p>
                          <p className="text-sm text-gray-600">{result.email}</p>
                        </div>
                        <button
                          onClick={() => handleAddMembre(result._id)}
                          disabled={isProcessing && selectedUserId === result._id}
                          className="bg-green-100 text-green-700 px-3 py-1 rounded-md hover:bg-green-200 transition-colors flex items-center"
                        >
                          {isProcessing && selectedUserId === result._id ? (
                            <FaSpinner className="animate-spin mr-1" />
                          ) : (
                            <FaUserPlus className="mr-1" />
                          )}
                          Ajouter
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold mb-4">Liste des membres ({membres.length})</h2>
            
            {membres.length === 0 ? (
              <p className="text-gray-500">Ce groupe n'a pas encore de membres.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Membre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date d'ajout
                      </th>
                      {canManageMembers && (
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {membres.map((membre) => (
                      <tr key={membre._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {membre.nom} {membre.prenom}
                              </div>
                              {membre._id === groupe.responsable?._id && (
                                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                  Responsable
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{membre.email}</div>
                          {membre.telephone && (
                            <div className="text-sm text-gray-500">{membre.telephone}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {membre.dateAjout
                            ? new Date(membre.dateAjout).toLocaleDateString()
                            : 'Non disponible'}
                        </td>
                        {canManageMembers && (
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {membre._id !== groupe.responsable?._id && membre._id !== user?._id && (
                              <button
                                onClick={() => handleRemoveMembre(membre._id)}
                                disabled={isProcessing && selectedUserId === membre._id}
                                className="text-red-600 hover:text-red-900 flex items-center ml-auto"
                              >
                                {isProcessing && selectedUserId === membre._id ? (
                                  <FaSpinner className="animate-spin mr-1" />
                                ) : (
                                  <FaUserMinus className="mr-1" />
                                )}
                                Retirer
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupeMembres;
