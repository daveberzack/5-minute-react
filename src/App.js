import { Routes, Route } from 'react-router-dom';
import AllGames from './components/AllGames';
import FavoriteGamesList from './components/FavoriteGamesList';
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
  const { isLoading, isAuthenticated, checkForRecentGameVisit, hasScoreForToday } = useAuth();
  
  const [defaultTab, setDefaultTab] = useState(() => {
    return localStorage.getItem('defaultTab') || 'all';
  });
  
  const [customLinks, setCustomLinks] = useState(() => {
    const saved = localStorage.getItem('customLinks');
    return saved ? JSON.parse(saved) : [];
  });

  // Listen for localStorage changes to update custom links
  // useEffect(() => {
  //   const handleStorageChange = () => {
  //     const saved = localStorage.getItem('customLinks');
  //     setCustomLinks(saved ? JSON.parse(saved) : []);
  //   };

  //   window.addEventListener('storage', handleStorageChange);
    
  //   // Also listen for custom event for same-tab updates
  //   window.addEventListener('customLinksUpdated', handleStorageChange);
    
  //   return () => {
  //     window.removeEventListener('storage', handleStorageChange);
  //     window.removeEventListener('customLinksUpdated', handleStorageChange);
  //   };
  // }, []);

  // Handle default tab navigation on initial load
  useEffect(() => {
    if (defaultTab === 'favorites' && location.pathname === '/' && !isLoading) {
      navigate('/favorites', { replace: true });
    }
  }, [isLoading]);

  // Check for recent game visits and auto-redirect to score entry
  useEffect(() => {
    const checkAutoRedirect = async () => {
      // Only check if user is authenticated and not already on edit score page
      if (!isAuthenticated || isLoading || location.pathname.includes('/edit-score')) {
        return;
      }

      try {
        const recentVisit = checkForRecentGameVisit();
        if (recentVisit) {
          // Check if user already has a score for this game today
          const hasScore = await hasScoreForToday(recentVisit.gameId);
          if (!hasScore) {
            // Redirect to score entry form
            navigate(`/edit-score/${recentVisit.gameId}`, {
              state: { from: location.pathname }
            });
          }
        }
      } catch (error) {
        console.error('Error checking for auto-redirect:', error);
      }
    };

    checkAutoRedirect();
  }, [isAuthenticated, isLoading, location.pathname, navigate]);

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
          <Route path="/favorites" element={<FavoriteGamesList customLinks={customLinks} defaultTab={defaultTab} updateDefaultTab={updateDefaultTab} />} />
          <Route path="/login" element={<Login />} />
          
          {/* Keep existing routes for backward compatibility */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
          <Route path="/edit-score/:gameId" element={<ProtectedRoute><EditScoreForm /></ProtectedRoute>} />
          <Route path="/editscore/:gameId" element={<ProtectedRoute><EditScoreForm /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;