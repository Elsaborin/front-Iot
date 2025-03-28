// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import { isAuthenticated } from './utils/auth';
import Parcelas from './pages/Parcelas';
import Graficos from './pages/Graficas';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute'; // Importa PrivateRoute
import ParcelasPochas from './pages/ParcelasPochas';

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        {/* Ruta protegida: solo accesible si el usuario está autenticado */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/parcelas"
          element={
            <PrivateRoute>
              <Parcelas />
            </PrivateRoute>
          }
        />

<Route
          path="/parcelas"
          element={
            <PrivateRoute>
              <Parcelas />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/parcelas-pochas"
          element={
            <PrivateRoute>
              <ParcelasPochas />
            </PrivateRoute>
          }
        />

        <Route
          path="/graficos"
          element={
            <PrivateRoute>
              <Graficos />
            </PrivateRoute>
          }
        />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
