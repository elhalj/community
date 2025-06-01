import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-600">
          Gérez vos cotisations facilement avec SeguiKro
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Une solution simple et efficace pour gérer les cotisations mensuelles de votre association ou groupe.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/register"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Commencer maintenant
          </Link>
          <Link
            to="/login"
            className="bg-gray-100 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-200 transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Fonctionnalités principales</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">Gestion des cotisations</h3>
            <p className="text-gray-600 text-center">
              Enregistrez et suivez facilement les cotisations de chaque membre mois par mois.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">Tableaux de bord</h3>
            <p className="text-gray-600 text-center">
              Visualisez les statistiques et l'état des cotisations avec des tableaux de bord intuitifs.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">Rapports et exports</h3>
            <p className="text-gray-600 text-center">
              Générez des rapports détaillés et exportez vos données facilement.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-50 p-12 rounded-lg text-center">
        <h2 className="text-3xl font-bold mb-4">Prêt à commencer?</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Rejoignez des milliers d'associations qui utilisent déjà SeguiKro pour gérer leurs cotisations.
        </p>
        <Link
          to="/register"
          className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors inline-block"
        >
          S'inscrire gratuitement
        </Link>
      </section>
    </div>
  );
};

export default Home;
