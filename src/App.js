import { Routes, Route, Navigate } from 'react-router-dom';
import FavoriteGames from './components/FavoriteGames';
import AllGames from './components/AllGames';
import Login from './components/Login';
import './App.css';
import EditScoreForm from './components/EditScoreForm';
import Signup from './components/Signup';
import Friends from './components/Friends';
import Navbar from './components/Navbar';
import { useData } from './utils/DataContext';

function App() {
  
  const { userData } = useData();
  
  // Function to check authentication and redirect accordingly
  const protectedRoute = (element) => {
    if (!userData) {
      return <Navigate to="/all" replace />;
    }
    return element;
  };

  return (
    <div className="App text-center">
      <Navbar />
      <main className="App-content max-w-xl mx-auto pt-10">
        <Routes>
          <Route path="/favorites" element={protectedRoute(<FavoriteGames />)} />
          <Route path="/edit-score" element={protectedRoute(<EditScoreForm />)} />
          <Route path="/friends" element={protectedRoute(<Friends />)} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/all" element={<AllGames />} />

          <Route path="/" element={ userData ? <FavoriteGames/> : <AllGames /> } />
        </Routes>
      </main>
    </div>
  );
}


export default App;
