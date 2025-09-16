import { Routes, Route, Navigate } from 'react-router-dom';
import FavoriteGames from './components/FavoriteGames';
import AllGames from './components/AllGames';
import Login from './components/Login';
import './App.css';
import EditScoreForm from './components/EditScoreForm';
import Signup from './components/Signup';
import Friends from './components/Friends';
import Navbar from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { isLoading, isAuthenticated } = useAuth();
  
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
    <div className="App text-center min-h-screen relative">
      <Navbar />
      <main className="App-content max-w-5xl mx-auto pt-16 px-2 sm:px-3 sm:pt-18 pb-6">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/all" element={<AllGames />} />
          
          <Route path="/favorites" element={<ProtectedRoute><FavoriteGames /></ProtectedRoute>} />
          <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
          <Route path="/edit-score/:gameId" element={<ProtectedRoute><EditScoreForm /></ProtectedRoute>} />
          
          <Route path="/" element={isAuthenticated ? <Navigate to="/favorites" replace /> : <Navigate to="/all" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
