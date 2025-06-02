import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGroupes } from '../hooks/useGroupes';
import { useTransactions } from '../hooks/useTransactions';
import useAuthStore from '../store/authStore';
import { toast } from 'react-toastify';
import { FaSpinner, FaArrowLeft, FaPlus, FaEdit, FaTrash, FaFilter } from 'react-icons/fa';

const GroupeTransactions = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const { getGroupeById } = useGroupes();
  const { getTransactionsByGroupe, deleteTransaction } = useTransactions();
  const deleteTransactionMutation = deleteTransaction;
  const isAdmin = user?.role === 'admin';
  
  // États pour le filtrage
  const [filters, setFilters] = useState({
    type: '',
    dateDebut: '',
    dateFin: '',
    categorie: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

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
    isLoading: isLoadingTransactions,
    isError: isErrorTransactions,
    error: errorTransactions
  } = getTransactionsByGroupe(id);

  const groupe = groupeData?.data;
  const transactions = transactionsData?.data || [];
  const isResponsable = groupe?.responsable?._id === user?._id;
  const canManageTransactions = isAdmin || isResponsable;

  // Gérer les changements de filtres
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      type: '',
      dateDebut: '',
      dateFin: '',
      categorie: ''
    });
  };

  // Filtrer les transactions
  const filteredTransactions = transactions.filter(transaction => {
    let match = true;
    
    if (filters.type && transaction.type !== filters.type) {
      match = false;
    }
    
    if (filters.categorie && transaction.categorie !== filters.categorie) {
      match = false;
    }
    
    if (filters.dateDebut) {
      const dateDebut = new Date(filters.dateDebut);
      const transactionDate = new Date(transaction.date);
      if (transactionDate < dateDebut) {
        match = false;
      }
    }
    
    if (filters.dateFin) {
      const dateFin = new Date(filters.dateFin);
      dateFin.setHours(23, 59, 59);
      const transactionDate = new Date(transaction.date);
      if (transactionDate > dateFin) {
        match = false;
      }
    }
    
    return match;
  });

  // Calculer les totaux
  const totalEntrees = filteredTransactions
    .filter(t => t.type === 'Entrée')
    .reduce((acc, curr) => acc + curr.montant, 0);
    
  const totalSorties = filteredTransactions
    .filter(t => t.type === 'Sortie')
    .reduce((acc, curr) => acc + curr.montant, 0);
    
  const balance = totalEntrees - totalSorties;

  // Gérer la suppression d'une transaction
  const handleDelete = async (id) => {
    try {
      await deleteTransactionMutation.mutateAsync(id);
      toast.success('Transaction supprimée avec succès');
      setDeleteId(null);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur lors de la suppression de la transaction');
    }
  };

  // Extraire les catégories uniques pour le filtre
  const categories = [...new Set(transactions.map(t => t.categorie))];

  // Afficher un message de chargement
  if (isLoadingGroupe || isLoadingTransactions) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-blue-600 text-4xl" />
      </div>
    );
  }

  // Afficher un message d'erreur
  if (isErrorGroupe || isErrorTransactions) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
        <p>Erreur: {errorGroupe?.message || errorTransactions?.message || 'Impossible de charger les données'}</p>
        <Link to={`/groupes/${id}`} className="text-blue-600 hover:underline mt-2 inline-block">
          Retour au groupe
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

      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Transactions du groupe: {groupe.nom}
            </h1>
            {canManageTransactions && (
              <Link
                to={`/groupes/${id}/transactions/nouvelle`}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <FaPlus className="mr-2" /> Nouvelle transaction
              </Link>
            )}
          </div>

          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-green-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-green-800">Total des entrées</h3>
                <p className="text-2xl font-bold text-green-700">
                  {totalEntrees.toLocaleString()} FCFA
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-red-800">Total des sorties</h3>
                <p className="text-2xl font-bold text-red-700">
                  {totalSorties.toLocaleString()} FCFA
                </p>
              </div>
              <div className={`${balance >= 0 ? 'bg-blue-50' : 'bg-yellow-50'} p-4 rounded-md`}>
                <h3 className={`text-sm font-medium ${balance >= 0 ? 'text-blue-800' : 'text-yellow-800'}`}>
                  Balance
                </h3>
                <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-700' : 'text-yellow-700'}`}>
                  {balance.toLocaleString()} FCFA
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <FaFilter className="mr-2" />
              {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
            </button>
            
            {showFilters && (
              <div className="mt-3 p-4 bg-gray-50 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={filters.type}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Tous</option>
                      <option value="Entrée">Entrée</option>
                      <option value="Sortie">Sortie</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="categorie" className="block text-sm font-medium text-gray-700 mb-1">
                      Catégorie
                    </label>
                    <select
                      id="categorie"
                      name="categorie"
                      value={filters.categorie}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Toutes</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="dateDebut" className="block text-sm font-medium text-gray-700 mb-1">
                      Date début
                    </label>
                    <input
                      type="date"
                      id="dateDebut"
                      name="dateDebut"
                      value={filters.dateDebut}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="dateFin" className="block text-sm font-medium text-gray-700 mb-1">
                      Date fin
                    </label>
                    <input
                      type="date"
                      id="dateFin"
                      name="dateFin"
                      value={filters.dateFin}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={resetFilters}
                    className="text-gray-600 hover:text-gray-800 mr-2"
                  >
                    Réinitialiser
                  </button>
                </div>
              </div>
            )}
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-yellow-800">
                Aucune transaction ne correspond aux critères sélectionnés.
              </p>
            </div>
          ) : (
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
                      Catégorie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                    {canManageTransactions && (
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.categorie}
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
                      {canManageTransactions && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <Link
                              to={`/groupes/${id}/transactions/${transaction._id}/modifier`}
                              className="text-yellow-600 hover:text-yellow-900"
                            >
                              <FaEdit />
                            </Link>
                            {deleteId === transaction._id ? (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleDelete(transaction._id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Confirmer
                                </button>
                                <button
                                  onClick={() => setDeleteId(null)}
                                  className="text-gray-600 hover:text-gray-900"
                                >
                                  Annuler
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteId(transaction._id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <FaTrash />
                              </button>
                            )}
                          </div>
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
  );
};

export default GroupeTransactions;
