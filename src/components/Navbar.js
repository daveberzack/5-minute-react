import { Link } from 'react-router-dom';
import { useData } from '../utils/DataContext';



function Navbar() {

  const { userData, signOutUser } = useData();
  console.log(userData)

  if (userData?.username) return (
    <nav className="bg-gray-800 py-2.5 fixed min-w-full">
      <ul className="flex list-none p-0 m-0 justify-center">
        <li className="mx-2.5">
          <Link to="/favorites" className="text-white no-underline px-2.5 py-1.5 rounded transition-colors duration-300 hover:bg-gray-600">Favorites</Link>
        </li>
        <li className="mx-2.5">
          <Link to="/all" className="text-white no-underline px-2.5 py-1.5 rounded transition-colors duration-300 hover:bg-gray-600">All</Link>
        </li>
        <li className="mx-2.5">
          <Link to="/friends" className="text-white no-underline px-2.5 py-1.5 rounded transition-colors duration-300 hover:bg-gray-600">Friends</Link>
        </li>
        <li className="mx-2.5">
          <a onClick={signOutUser} className="text-white no-underline px-2.5 py-1.5 rounded transition-colors duration-300 hover:bg-gray-600 cursor-pointer">Log Out</a>
        </li>
      </ul>
    </nav>
  )
  else return (
    <nav className="bg-gray-800 py-2.5 fixed min-w-full">
      <Link to="/login" className="text-white no-underline px-2.5 py-1.5 rounded transition-colors duration-300 hover:bg-gray-600">Log In</Link>
    </nav>
  );
}

export default Navbar;