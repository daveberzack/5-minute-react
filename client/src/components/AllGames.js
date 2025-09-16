import { useAuth } from '../contexts/AuthContext';
import { games } from '../games';

function AllGames() {

  const { user, addFavorite, removeFavorite } = useAuth();

  const onClickFavorite = (e)=> {
    const id = parseInt(e.target.dataset.id);
    console.log("favorite",id);
    addFavorite(id);
  }
  const onClickUnfavorite = (e)=> {
    const id = parseInt(e.target.dataset.id);
    console.log("unfavorite",id);
    removeFavorite(id);
  }

  return (
    <section id="other-games" className="max-w-4xl mx-auto p-2 sm:p-3 relative z-10">
      <h2 className="text-2xl font-bold text-black text-left mb-3">All Games</h2>
      
      <ul id="other-games-list" className="list-none p-0 space-y-1.5">
        { games?.map( f=> {
          const isFavorite = user?.favorites.includes(f.id);
          const starFill = isFavorite ? 'fill-yellow-400' : 'fill-white/50';
          
          const addRemoveButton = (
            <button
              data-id={f.id}
              onClick={isFavorite ? onClickUnfavorite : onClickFavorite}
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center focus:outline-none flex-shrink-0 star-favorite hover:bg-white/10 rounded-full transition-all duration-300"
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <svg
                viewBox="0 0 24 24"
                className={`w-6 h-6 sm:w-7 sm:h-7 stroke-gray-700 stroke-2 ${starFill} transition-all duration-300 pointer-events-none drop-shadow-sm`}
              >
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </button>
          );
          
          return (
            <li key={f.id} className="game-card text-gray-800 py-2 px-2.5 flex justify-between items-center group">
              <a href={f.url} className="block flex hover:text-blue-600 flex-1 min-w-0 transition-colors duration-300">
                <div className="relative">
                  <img
                    src={"./img/games/"+f.image}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 border-gray-200 mr-3 flex-shrink-0 shadow-sm group-hover:shadow-md transition-all duration-300"
                    alt={f.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-lg pointer-events-none"></div>
                </div>
                <div className="text-left min-w-0 flex-1 flex flex-col justify-center">
                  <p className="font-bold text-base sm:text-lg truncate mb-0.5 group-hover:text-blue-600 transition-colors duration-300">{f.name}</p>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{f.caption}</p>
                </div>
              </a>
              {!!user?.username && addRemoveButton}
            </li>
          );
        })}
      </ul>
    </section>
  );

}

export default AllGames;