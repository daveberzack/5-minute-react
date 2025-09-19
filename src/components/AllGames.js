import { useAuth } from '../contexts/AuthContext';
import { games } from '../data/games';

function AllGames() {

  const { user, favorites, addFavorite, removeFavorite } = useAuth();

  const onClickFavorite = (e)=> {
    const id = parseInt(e.target.dataset.id);
    addFavorite(id);
  }
  const onClickUnfavorite = (e)=> {
    const id = parseInt(e.target.dataset.id);
    removeFavorite(id);
  }

  return (
    <section id="other-games" >     
      <ul id="other-games-list" className="list-none p-0 space-y-1.5 w-full">
        { games?.map( f=> {
          const isFavorite = favorites.includes(f.id*1);

          const addRemoveButton = (
              <img 
                data-id={f.id}
                onClick={isFavorite ? onClickUnfavorite : onClickFavorite}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center focus:outline-none flex-shrink-0"
                src={isFavorite ? "./img/star_full.png" : "./img/star_empty.png"} alt={isFavorite ? "Remove from favorites" : "Add to favorites"}
              />
          );
          
          return (
            <li key={f.id} className="w-full text-white py-1.5 px-2 flex justify-between items-center group relative bg-gradient-to-b from-white/5 via-white/2 to-transparent">
              <a href={f.url} className="block flex flex-1 min-w-0">
                <img
                    src={"./img/games/"+f.image}
                    className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 border-gray-200 mr-3 flex-shrink-0 shadow-sm group-hover:shadow-md transition-all duration-300"
                    alt={f.name}
                />
                <div className="text-left min-w-0 flex-1 flex flex-col justify-center">
                  <p className="font-bold text-base sm:text-lg truncate mb-0.5 ">{f.name}</p>
                  <p className="text-xs sm:text-sm text-white/70 line-clamp-2">{f.caption}</p>
                </div>
              </a>
              {addRemoveButton}
            </li>
          );
        })}
      </ul>
    </section>
  );

}

export default AllGames;