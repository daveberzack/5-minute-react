import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const location = useLocation();
  const { user } = useAuth();

  const isLoggedIn = user?.username;

  const socialLink = isLoggedIn ? "/social" : "/login";

  const isActiveTab = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname === path) return true;
    return false;
  };

  return (
    <nav className="w-full z-50 bg-blue-800">
      <div className="w-full">
        <div className="max-w-4xl mx-auto h-14 flex items-center px-4 relative">
          <img src='./img/nicelight.png' alt="Nice Light Games" className='h-12 w-12 mr-3'/>
          <div>
            <h1 className="text-white text-2xl font-bold">Nice Light Games</h1>
            <p className="text-blue-200 text-xs">The Friendliest Place on the Internet</p>
          </div>
        </div>
      </div>
      
      {/* Tab navigation */}
      <div className="w-full mt-1">
        <div className="max-w-4xl mx-auto flex justify-start items-end gap-1 px-4">
          <Link
            to="/"
            className={`px-3 py-1 font-bold transition-colors duration-200 ${
              isActiveTab('/')
                ? 'bg-blue-300 text-blue-800'
                : 'bg-blue-600 text-white hover:bg-blue-500'
            }`}
            style={{ borderRadius: '0.3125rem 0.3125rem 0 0' }}
          >
            <div className="flex items-center">
              <img src="/svgs/menu.svg" alt="All Games" className="w-4 h-4 mr-2 hidden min-[400px]:inline" />
              All Games
            </div>
          </Link>
          
          <Link
            to="/favorites"
            className={`px-3 py-1 font-bold transition-colors duration-200 ${
              isActiveTab('/favorites')
                ? 'bg-blue-300 text-blue-800'
                : 'bg-blue-600 text-white hover:bg-blue-500'
            }`}
            style={{ borderRadius: '0.3125rem 0.3125rem 0 0' }}
          >
            <div className="flex items-center">
              <img src="/svgs/star-filled.svg" alt="Favorites" className="w-4 h-4 mr-2 hidden min-[400px]:inline" />
              Favorites
            </div>
          </Link>
          
          {isLoggedIn ? (
            <Link
              to="/friends"
              className={`px-3 py-1 font-bold transition-colors duration-200 ${
                isActiveTab('/friends')
                  ? 'bg-blue-300 text-blue-800'
                  : 'bg-blue-600 text-white hover:bg-blue-500'
              }`}
              style={{ borderRadius: '0.3125rem 0.3125rem 0 0' }}
            >
              <div className="flex items-center">
                <img src="/svgs/friends.svg" alt="Friends" className="w-4 h-4 mr-2 hidden min-[400px]:inline" />
                Friends
              </div>
            </Link>
          ) : (
            <Link
              to="/login"
              className={`px-3 py-1 font-bold transition-colors duration-200 ${
                isActiveTab('/login')
                  ? 'bg-blue-300 text-blue-800'
                  : 'bg-blue-600 text-white hover:bg-blue-500'
              }`}
              style={{ borderRadius: '0.3125rem 0.3125rem 0 0' }}
            >
              <div className="flex items-center">
                <img src="/svgs/user.svg" alt="Profile" className="w-4 h-4 mr-2 hidden min-[400px]:inline" />
                Login
              </div>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;