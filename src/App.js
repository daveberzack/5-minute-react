import { Routes, Route, Navigate } from 'react-router-dom';
import AllGames from './components/AllGames';
import FavoriteGames from './components/FavoriteGames';
import AddLink from './components/AddLink';
import LoginCompact from './components/LoginCompact';
import Login from './components/Login';
import './App.css';
import EditScoreForm from './components/EditScoreForm';
import Signup from './components/Signup';
import Friends from './components/Friends';
import Navbar from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, isAuthenticated } = useAuth();
  
  const [defaultTab, setDefaultTab] = useState(() => {
    return localStorage.getItem('defaultTab') || 'all';
  });
  
  const [customLinks, setCustomLinks] = useState(() => {
    const saved = localStorage.getItem('customLinks');
    return saved ? JSON.parse(saved) : [];
  });

  // Listen for localStorage changes to update custom links
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('customLinks');
      setCustomLinks(saved ? JSON.parse(saved) : []);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom event for same-tab updates
    window.addEventListener('customLinksUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('customLinksUpdated', handleStorageChange);
    };
  }, []);

  // Handle default tab navigation on initial load only
  useEffect(() => {
    // Only run this effect once on initial load when coming from root path
    if (defaultTab === 'favorites' && location.pathname === '/' && !isLoading) {
      navigate('/favorites', { replace: true });
    }
  }, [isLoading]); // Only depend on isLoading, not on location changes

  const updateDefaultTab = (tab) => {
    setDefaultTab(tab);
    localStorage.setItem('defaultTab', tab);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative z-10">
        <div className="glass-card p-6 rounded-xl shadow-xl text-center">
          <div className="loading-spinner mx-auto mb-3"></div>
          <h3 className="text-lg font-semibold text-gradient mb-1">Loading</h3>
          <p className="text-gray-600 text-sm">Preparing your gaming experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App text-center min-h-screen relative max-w-4xl mx-auto">
      <Navbar />
      <main className="App-content">
        <Routes>
          <Route path="/" element={<AllGames defaultTab={defaultTab} updateDefaultTab={updateDefaultTab} />} />
          <Route path="/favorites" element={<FavoriteGames customLinks={customLinks} defaultTab={defaultTab} updateDefaultTab={updateDefaultTab} />} />
          <Route path="/add" element={<AddLink />} />
          <Route path="/login" element={<LoginCompact />} />
          
          {/* Keep existing routes for backward compatibility */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
          <Route path="/edit-score/:gameId" element={<ProtectedRoute><EditScoreForm /></ProtectedRoute>} />
          <Route path="/social" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;


/*
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/all" element={<AllGames />} />
          
          <Route path="/favorites" element={<ProtectedRoute><FavoriteGames /></ProtectedRoute>} />
          <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
          <Route path="/edit-score/:gameId" element={<ProtectedRoute><EditScoreForm /></ProtectedRoute>} />
          
          <Route path="/" element={isAuthenticated ? <Navigate to="/favorites" replace /> : <Navigate to="/all" replace />} />
*/
