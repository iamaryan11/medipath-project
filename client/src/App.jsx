import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/AuthContext';
import { ThemeProvider } from './hooks/ThemeContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FirstAid from './pages/FirstAid';
import Medicines from './pages/Medicines';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-hosp-bg text-hosp-text font-body transition-colors duration-300">
            <Toaster position="bottom-right" toastOptions={{
               className: 'bg-hosp-surface text-hosp-text border border-hosp-border shadow-md',
               style: { borderRadius: '10px', background: 'var(--hosp-surface)', color: 'var(--hosp-text)' }
            }} />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/first-aid" element={<FirstAid />} />
              <Route path="/medicines" element={<Medicines />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
