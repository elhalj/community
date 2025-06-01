import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Cotisations from './pages/Cotisations';
import CotisationDetail from './pages/CotisationDetail';
import CotisationForm from './pages/CotisationForm';
import Groupes from './pages/Groupes';
import GroupeDetail from './pages/GroupeDetail';
import GroupeForm from './pages/GroupeForm';
import GroupeMembres from './pages/GroupeMembres';
import GroupeTransactions from './pages/GroupeTransactions';
import TransactionForm from './pages/TransactionForm';
import NotFound from './pages/NotFound';

// Auth Store
import useAuthStore from './store/authStore';

// Créer un client React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Route protégée pour les utilisateurs authentifiés
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Route protégée pour les administrateurs
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* Routes publiques */}
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            
            {/* Routes protégées */}
            <Route path="dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="cotisations" element={
              <ProtectedRoute>
                <Cotisations />
              </ProtectedRoute>
            } />
            <Route path="cotisations/:id" element={
              <ProtectedRoute>
                <CotisationDetail />
              </ProtectedRoute>
            } />
            <Route path="cotisations/new" element={
              <ProtectedRoute>
                <CotisationForm />
              </ProtectedRoute>
            } />
            <Route path="cotisations/:id/edit" element={
              <ProtectedRoute>
                <CotisationForm />
              </ProtectedRoute>
            } />
            
            {/* Routes pour les groupes */}
            <Route path="groupes" element={
              <ProtectedRoute>
                <Groupes />
              </ProtectedRoute>
            } />
            <Route path="groupes/:id" element={
              <ProtectedRoute>
                <GroupeDetail />
              </ProtectedRoute>
            } />
            <Route path="groupes/nouveau" element={
              <ProtectedRoute>
                <GroupeForm />
              </ProtectedRoute>
            } />
            <Route path="groupes/:id/modifier" element={
              <ProtectedRoute>
                <GroupeForm />
              </ProtectedRoute>
            } />
            <Route path="groupes/:id/membres" element={
              <ProtectedRoute>
                <GroupeMembres />
              </ProtectedRoute>
            } />
            <Route path="groupes/:id/transactions" element={
              <ProtectedRoute>
                <GroupeTransactions />
              </ProtectedRoute>
            } />
            <Route path="groupes/:groupeId/transactions/nouvelle" element={
              <ProtectedRoute>
                <TransactionForm />
              </ProtectedRoute>
            } />
            <Route path="groupes/:groupeId/transactions/:transactionId/modifier" element={
              <ProtectedRoute>
                <TransactionForm />
              </ProtectedRoute>
            } />
            
            {/* Routes administrateur */}
            <Route path="admin" element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            } />
            
            {/* Route 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App
