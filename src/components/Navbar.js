import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const location = useLocation();
  const { user } = useAuth();

  const isLoggedIn = user?.username;

  const socialLink = isLoggedIn ? "/social" : "/login";
  
  const tabs = [
    {
      id: 'all',
      label: 'All Games',
      path: '/',
      icon: (
        <svg className="w-4 h-4 mr-2 hidden min-[400px]:inline" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/>
        </svg>
      )
    },
    {
      id: 'favorites',
      label: 'Favorites',
      path: '/favorites',
      icon: (
        <svg className="w-4 h-4 mr-2 hidden min-[400px]:inline" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      )
    },
    ...(isLoggedIn ? [{
      id: 'friends',
      label: 'Friends',
      path: '/friends',
      icon: (
        <svg className="w-4 h-4 mr-2 hidden min-[400px]:inline" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-4h2l-3-4-3 4h2v4H4zm8.5-5c.83 0 1.5-.67 1.5-1.5S13.33 10 12.5 10s-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm3-2c.83 0 1.5-.67 1.5-1.5S16.33 9 15.5 9s-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm1 2c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-2.5 3c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/>
        </svg>
      )
    }] : [{
      id: 'login',
      label: 'Login',
      path: '/login',
      icon: (
        <svg className="w-4 h-4 mr-2 hidden min-[400px]:inline" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      )
    }])
  ];

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
              <div className="flex items-center">
                {tab.icon}
                {tab.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;