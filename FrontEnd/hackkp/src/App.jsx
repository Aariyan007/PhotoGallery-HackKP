import { Suspense, lazy, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Lazy load components
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const PhotoGalleryDashboard = lazy(() => import('./components/Home'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      <p className="text-white text-lg">Loading...</p>
    </div>
  </div>
);

// Auth wrapper component to manage authentication state
const AuthWrapper = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <>
      {children({ user, isAuthenticated, handleLogin, handleLogout })}
    </>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children, isAuthenticated }) => {
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

// Main App Component
function App() {
  return (
    <AuthWrapper>
      {({ user, isAuthenticated, handleLogin, handleLogout }) => (
        <Router>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route 
                path="/" 
                element={
                  isAuthenticated ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <Login onLogin={handleLogin} />
                  )
                } 
              />
              <Route 
                path="/register" 
                element={
                  isAuthenticated ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <Register onRegister={handleLogin} />
                  )
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <PhotoGalleryDashboard user={user} onLogout={handleLogout} />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
      )}
    </AuthWrapper>
  );
}

export default App;