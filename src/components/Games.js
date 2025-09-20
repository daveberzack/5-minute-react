import { Link } from 'react-router-dom';
import AllGames from "./AllGames";
import FavoriteGames from "./FavoriteGames"

function Games() {

  return (
    <section id="games" className="p-0 m-0">
      <FavoriteGames />
      
      {/* Tab and button container */}
      <div className="flex justify-between items-start" style={{ margin: '0.3125rem', marginBottom: 0 }}>
        {/* Tab container with dark blue background */}
        <div className="bg-blue-800 flex" style={{ borderRadius: '0.3125rem 0.3125rem 0 0' }}>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 font-bold" style={{ borderRadius: '0.3125rem 0.3125rem 0 0' }}>
            All Games
          </div>
        </div>
        
        {/* Add link button */}
        <Link
          to="/new"
          className="bg-blue-100 text-blue-800 px-4 py-2 font-bold hover:bg-blue-200 transition-colors duration-200"
          style={{ borderRadius: '0.3125rem', marginBottom: '0.625rem' }}
        >
          Add Link
        </Link>
      </div>
      
      <AllGames />
    </section>
  );

}

export default Games;