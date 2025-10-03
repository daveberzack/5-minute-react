import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const location = useLocation();
  const { user } = useAuth();

  const isLoggedIn = user?.username;

  const socialLink = isLoggedIn ? "/social" : "/login";
  
  const tabs = [
    { id: 'all', label: 'All Games', path: '/' },
    { id: 'favorites', label: 'Favorites', path: '/favorites' },
    { id: 'login', label: 'Login', path: '/login' }
  ];

  const isActiveTab = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname === path) return true;
    return false;
  };

  return (
    <nav className="w-full z-50">
      <div className="w-full bg-blue-800">
        <div className="max-w-4xl mx-auto h-14 flex items-center px-4 relative">
          <img src='./img/nicelight.png' alt="Nice Light Games" className='h-12 w-12 mr-3'/>
          <div>
            <h1 className="text-white text-2xl font-bold leading-tight">Nice Light Games</h1>
            <p className="text-blue-200 text-xs leading-tight">The Friendliest Place on the Internet</p>
          </div>
        </div>
      </div>
      
      {/* Tab navigation */}
      <div className="w-full bg-blue-800">
        <div className="max-w-4xl mx-auto flex justify-start items-end gap-1 px-4">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              to={tab.path}
              className={`px-3 py-1 font-bold transition-colors duration-200 ${
                isActiveTab(tab.path)
                  ? 'bg-blue-300 text-blue-800'
                  : 'bg-blue-600 text-white hover:bg-blue-500'
              }`}
              style={{ borderRadius: '0.3125rem 0.3125rem 0 0' }}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;