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
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="App text-center">
      <Navbar />
      <main className="App-content max-w-xl mx-auto pt-12 px-1 sm:px-2 sm:pt-16">
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
