import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCotisations } from '../hooks/useCotisations';
import useAuthStore from '../store/authStore';

const Cotisations = () => {
  const { user } = useAuthStore();
  const { allCotisationsQuery, useCotisationsByMembre } = useCotisations();
  const [filters, setFilters] = useState({
    mois: '',
    annee: new Date().getFullYear(),
    statut: '',
  });

  // Utiliser la requête appropriée en fonction du rôle de l'utilisateur
  const membreQuery = useCotisationsByMembre(user?.role !== 'admin' ? user?._id : null);
  
  const cotisationsQuery = user?.role === 'admin' 
    ? allCotisationsQuery 
    : membreQuery;

  // Filtrer les cotisations
  const filteredCotisations = cotisationsQuery.data?.filter((cotisation) => {
    let match = true;
    if (filters.mois && cotisation.mois !== filters.mois) match = false;
    if (filters.annee && cotisation.annee !== parseInt(filters.annee)) match = false;
    if (filters.statut && cotisation.statut !== filters.statut) match = false;
    return match;
  }) || [];

  // Liste des mois pour le filtre
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  // Générer les années pour le filtre (5 ans en arrière et 5 ans en avant)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  // Statuts pour le filtre
  const statuses = ['En attente', 'Confirmé', 'Rejeté'];

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

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Cotisations</h1>
        <Link
          to="/cotisations/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Nouvelle cotisation
        </Link>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">Filtres</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="mois" className="block text-sm font-medium text-gray-700 mb-1">
              Mois
            </label>
            <select
              id="mois"
              value={filters.mois}
              onChange={(e) => setFilters({ ...filters, mois: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les mois</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="annee" className="block text-sm font-medium text-gray-700 mb-1">
              Année
            </label>
            <select
              id="annee"
              value={filters.annee}
              onChange={(e) => setFilters({ ...filters, annee: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes les années</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="statut" className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              id="statut"
              value={filters.statut}
              onChange={(e) => setFilters({ ...filters, statut: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les statuts</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Liste des cotisations */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {cotisationsQuery.isLoading ? (
          <div className="p-6 text-center">
            <p>Chargement des cotisations...</p>
          </div>
        ) : cotisationsQuery.isError ? (
          <div className="p-6 text-center text-red-600">
            <p>Erreur lors du chargement des cotisations</p>
          </div>
        ) : filteredCotisations.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>Aucune cotisation trouvée pour les filtres sélectionnés</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mois/Année
                  </th>
                  {user?.role === 'admin' && (
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Membre
                    </th>
                  )}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de paiement
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Méthode
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCotisations.map((cotisation) => (
                  <tr key={cotisation._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {cotisation.mois} {cotisation.annee}
                      </div>
                    </td>
                    {user?.role === 'admin' && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {cotisation.membre?.nom} {cotisation.membre?.prenom}
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {cotisation.montant.toLocaleString()} FCFA
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(cotisation.datePaiement)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {cotisation.methodePaiement}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(cotisation.statut)}`}>
                        {cotisation.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/cotisations/${cotisation._id}`}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Voir
                      </Link>
                      {cotisation.statut === 'En attente' && (
                        <Link
                          to={`/cotisations/${cotisation._id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Modifier
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cotisations;
