import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  // Duck logo SVG
  const DuckLogo = () => (
    <svg width="32" height="32" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M96 24C85.5 24 76.5 30 72 39C67.5 30 58.5 24 48 24C32.5 24 20 36.5 20 52C20 67.5 32.5 80 48 80H72V96C72 113 85 126 102 126H144C161 126 174 113 174 96V80C174 63 161 50 144 50H120V40C120 31 113 24 104 24H96Z" fill="#FFD700"/>
      <path d="M48 32C54.6 32 60 37.4 60 44C60 50.6 54.6 56 48 56C41.4 56 36 50.6 36 44C36 37.4 41.4 32 48 32Z" fill="#FF8C00"/>
      <circle cx="52" cy="44" r="4" fill="#000"/>
      <path d="M96 40C102.6 40 108 45.4 108 52V72H144C152.8 72 160 79.2 160 88V96C160 104.8 152.8 112 144 112H102C93.2 112 86 104.8 86 96V80H48C39.2 80 32 72.8 32 64C32 55.2 39.2 48 48 48C56.8 48 64 55.2 64 64V72H86V52C86 45.4 91.4 40 98 40H96Z" fill="#FFA500"/>
      <ellipse cx="96" cy="140" rx="48" ry="12" fill="#4A5568" opacity="0.3"/>
    </svg>
  );

  // Navigation icons
  const FavoritesIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
    </svg>
  );

  const AllGamesIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 6H20V8H4V6M4 11H20V13H4V11M4 16H20V18H4V16Z"/>
    </svg>
  );

  const FriendsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 4C18.2 4 20 5.8 20 8S18.2 12 16 12C15.7 12 15.4 12 15.1 11.9C15.6 10.7 16 9.4 16 8S15.6 5.3 15.1 4.1C15.4 4 15.7 4 16 4M12.5 11.5C14.4 11.5 16 9.9 16 8S14.4 4.5 12.5 4.5 9 6.1 9 8 10.6 11.5 12.5 11.5M12.5 13C10.5 13 6.5 14 6.5 16V18H18.5V16C18.5 14 14.5 13 12.5 13M16 13.9C17.2 13.9 20 14.5 20 16V18H20V16C20 15.2 18.9 14.3 17.1 13.9H16Z"/>
    </svg>
  );

  const LoginIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 17V14H3V10H10V7L15 12L10 17M10 2H19C20.1 2 21 2.9 21 4V20C21 21.1 20.1 22 19 22H10C8.9 22 8 21.1 8 20V18H10V20H19V4H10V6H8V4C8 2.9 8.9 2 10 2Z"/>
    </svg>
  );

  const LogoutIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.08 15.59L16.67 13H7V11H16.67L14.08 8.41L15.49 7L20.49 12L15.49 17L14.08 15.59M19 3C20.1 3 21 3.9 21 5V9.67L19 7.67V5H5V19H19V16.33L21 14.33V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H19Z"/>
    </svg>
  );

  const getTabClass = (path) => {
    const isActive = location.pathname === path;
    return `flex items-center justify-center px-3 py-2 rounded-t-lg transition-all duration-200 ${
      isActive
        ? 'bg-gray-100 text-gray-800 border-b-2 border-blue-500'
        : 'text-white hover:bg-gray-700'
    }`;
  };

  if (isAuthenticated && user?.username) {
    return (
      <nav className="bg-gray-800 py-2 fixed w-full z-10">
        <div className="flex items-center justify-between px-4">
          {/* Logo and Navigation Tabs */}
          <div className="flex items-center space-x-4">
            <DuckLogo />
            <div className="flex space-x-1">
              <Link to="/favorites" className={getTabClass('/favorites')} title="Favorites">
                <FavoritesIcon />
              </Link>
              <Link to="/all" className={getTabClass('/all')} title="All Games">
                <AllGamesIcon />
              </Link>
              <Link to="/friends" className={getTabClass('/friends')} title="Friends">
                <FriendsIcon />
              </Link>
            </div>
          </div>
          
          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center justify-center p-2 text-white hover:bg-gray-700 rounded transition-colors duration-200"
            title="Log Out"
          >
            <LogoutIcon />
          </button>
        </div>
      </nav>
    );
  } else {
    return (
      <nav className="bg-gray-800 py-2 fixed w-full z-10">
        <div className="flex items-center justify-between px-4">
          {/* Logo */}
          <DuckLogo />
          
          {/* Login Button */}
          <Link
            to="/login"
            className="flex items-center justify-center p-2 text-white hover:bg-gray-700 rounded transition-colors duration-200"
            title="Log In"
          >
            <LoginIcon />
          </Link>
        </div>
      </nav>
    );
  }
}

export default Navbar;