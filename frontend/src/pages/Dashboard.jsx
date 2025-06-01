import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { useCotisations } from '../hooks/useCotisations';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { getAllCotisations, getCotisationsByMembre } = useCotisations();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [stats, setStats] = useState({
    totalCotisations: 0,
    cotisationsPaid: 0,
    cotisationsPending: 0,
    cotisationsRejected: 0,
  });

  // Utiliser la requête appropriée en fonction du rôle de l'utilisateur
  const cotisationsQuery = user?.role === 'admin' 
    ? getAllCotisations() 
    : getCotisationsByMembre(user?._id);

  // Calculer les statistiques lorsque les données changent
  useEffect(() => {
    if (cotisationsQuery.data) {
      const cotisations = cotisationsQuery.data;
      
      // Filtrer par année sélectionnée
      const filteredCotisations = cotisations.filter(
        (cotisation) => cotisation.annee === selectedYear
      );
      
      // Calculer les statistiques
      const totalCotisations = filteredCotisations.length;
      const cotisationsPaid = filteredCotisations.filter(
        (cotisation) => cotisation.statut === 'Confirmé'
      ).length;
      const cotisationsPending = filteredCotisations.filter(
        (cotisation) => cotisation.statut === 'En attente'
      ).length;
      const cotisationsRejected = filteredCotisations.filter(
        (cotisation) => cotisation.statut === 'Rejeté'
      ).length;
      
      setStats({
        totalCotisations,
        cotisationsPaid,
        cotisationsPending,
        cotisationsRejected,
      });
    }
  }, [cotisationsQuery.data, selectedYear]);

  // Générer les années pour le filtre (5 ans en arrière et 5 ans en avant)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  // Générer les mois pour l'affichage
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  // Fonction pour obtenir le statut d'un mois
  const getMonthStatus = (month) => {
    if (!cotisationsQuery.data) return 'unknown';
    
    const cotisation = cotisationsQuery.data.find(
      (c) => c.mois === month && c.annee === selectedYear && c.membre === user?._id
    );
    
    if (!cotisation) return 'missing';
    return cotisation.statut;
  };

  // Fonction pour obtenir la classe CSS en fonction du statut
  const getStatusClass = (status) => {
    switch (status) {
      case 'Confirmé':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Rejeté':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'missing':
        return 'bg-gray-100 text-gray-500 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-500 border-gray-300';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Tableau de bord
        </h1>
        <p className="text-gray-600">
          Bienvenue, {user?.prenom} {user?.nom}
        </p>
      </div>

      {/* Filtre par année */}
      <div className="mb-6">
        <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
          Sélectionner l'année:
        </label>
        <select
          id="year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm">Total des cotisations</h3>
          <p className="text-2xl font-bold">{stats.totalCotisations}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm">Cotisations payées</h3>
          <p className="text-2xl font-bold">{stats.cotisationsPaid}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h3 className="text-gray-500 text-sm">En attente</h3>
          <p className="text-2xl font-bold">{stats.cotisationsPending}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
          <h3 className="text-gray-500 text-sm">Rejetées</h3>
          <p className="text-2xl font-bold">{stats.cotisationsRejected}</p>
        </div>
      </div>

      {/* Aperçu des cotisations par mois */}
      {user?.role !== 'admin' && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Vos cotisations pour {selectedYear}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {months.map((month) => {
              const status = getMonthStatus(month);
              return (
                <div
                  key={month}
                  className={`p-4 rounded-md border ${getStatusClass(status)}`}
                >
                  <h3 className="font-medium">{month}</h3>
                  <p className="text-sm mt-1">
                    {status === 'missing' ? 'Non payée' : status}
                  </p>
                  {status === 'missing' && (
                    <Link
                      to="/cotisations/new"
                      className="text-blue-600 text-sm hover:underline mt-2 inline-block"
                    >
                      Payer maintenant
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Actions rapides */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/cotisations/new"
            className="bg-blue-100 text-blue-700 p-4 rounded-md hover:bg-blue-200 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Enregistrer une cotisation
          </Link>
          <Link
            to="/cotisations"
            className="bg-green-100 text-green-700 p-4 rounded-md hover:bg-green-200 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            Voir toutes les cotisations
          </Link>
          <Link
            to="/profile"
            className="bg-purple-100 text-purple-700 p-4 rounded-md hover:bg-purple-200 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            Gérer mon profil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
