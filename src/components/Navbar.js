import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { user } = useAuth();

  const isLoggedIn = user?.username;

  const socialLink = isLoggedIn ? "/social" : "/login";
  
  return (
    <nav className="fixed top-0 w-full z-50 shadow-lg">
      <div className="w-full bg-blue-300">
        <div className="max-w-4xl mx-auto h-12 flex items-center justify-between px-1 relative">
          <div className="flex-1 ml-12">
            <h1 className="text-white text-2xl font-bold text-left">Good Little Games</h1>
          </div>

          <div className="flex items-center">
            <Link to={socialLink} className="flex items-center">
              <img src='./img/social.png' alt="Social" className='h-10 w-10'/>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="w-full bg-blue-800">
        <div className="max-w-4xl mx-auto h-7 flex items-center px-1">
          <div className="ml-12">
            <h2 className="text-yellow-300 text-xs font-medium">The Friendliest Place on the Internet</h2>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto relative">
        <img src='./img/glg_logo.png' alt="Good Little Games Logo" className='absolute top-2 left-2 h-16 z-10'/>
      </div>
    </nav>
  );
}

export default Navbar;