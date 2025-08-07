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
    <section id="other-games" className="max-w-4xl mx-auto p-4">
      <ul id="other-games-list" className="list-none p-0 space-y-2">
        { games?.map( f=> {
          const isFavorite = user?.favorites.includes(f.id);
          const itemColors = isFavorite ? `bg-white` : `bg-blue-100`;
          const starFill = isFavorite ? 'fill-yellow-400' : 'fill-white';
          
          const addRemoveButton = (
            <button
              data-id={f.id}
              onClick={isFavorite ? onClickUnfavorite : onClickFavorite}
              className="w-10 h-10 flex items-center justify-center focus:outline-none"
            >
              <svg
                viewBox="0 0 24 24"
                className={`w-9 h-9 stroke-black stroke-2 ${starFill} transition-all duration-800 pointer-events-none`}
              >
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </button>
          );
          
          return (
            <li key={f.id} className={itemColors+" text-black transition-all duration-800 rounded-lg shadow-sm py-1 px-2 hover:shadow-lg flex justify-between items-center"}>
              <a href={f.url} className="block flex hover:text-blue-600">
                <img src={"./img/games/"+f.image} className="w-12 h-12 rounded-md border-2 border-black mr-1"/>
                <div className="text-left">
                  <p className="font-bold text-lg">{f.name}</p>
                  <p className="text-sm">{f.caption}</p>
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