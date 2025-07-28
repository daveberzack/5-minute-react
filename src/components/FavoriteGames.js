import { useState, useEffect } from 'react';
import { useData } from '../utils/DataContext';

function FavoriteGames() {

  const { userData, games, removeFavorite, setGameToEditPlay } = useData();

  const [favoriteGames, setFavoriteGames] = useState([]);

  useEffect(()=>{
        let fg = userData?.favorites.map( favoriteId => {
            return games.find( g => g.id == favoriteId )
        });
        fg = fg || [];
        fg.forEach( game => {
          const myPlay = userData.todayPlays[game.id];
          game.scores = {
            me: myPlay
          };
        });
        
        setFavoriteGames(fg);
        
  },[games, userData]);

  const onClickEditPlay = (e)=> {
    const id = parseInt(e.target.dataset.id);
    setGameToEditPlay(id);
  }

  return (
    <section id="favorite-games" className="max-w-4xl mx-auto p-4">
      <ul id="favorite-games-list" className="list-none p-0 space-y-2">
        { favoriteGames?.map( f => {
          // Determine if there's a score to display
          const hasScore = !!f.scores?.me;
          
          // Create the score/edit button element
          let myScore;
          if (hasScore) {
            myScore = (
              <div className="flex items-center">
                <span className="text-gray-700 mr-2">
                  {f.scores.me?.score} [{f.scores.me?.message}]
                </span>
                <button
                  data-id={f.id}
                  onClick={onClickEditPlay}
                  className="bg-blue-600 text-white text-xs px-2 py-1 rounded hover:bg-[#282850] transition-colors duration-200 font-medium"
                >
                  EDIT
                </button>
              </div>
            );
          } else {
            myScore = (
              <button
                data-id={f.id}
                onClick={onClickEditPlay}
                className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-[#282850] transition-colors duration-200 shadow-sm"
              >
                +
              </button>
            );
          }

          return (
            <li key={f.id} className="bg-white text-black rounded-lg shadow-sm py-1 px-2 hover:shadow-lg transition-all duration-300 flex justify-between items-center">
              <a href={f.url} className="block flex hover:text-blue-600 items-center">
                <img src={"./img/games/"+f.image} className="w-12 h-12 rounded-md border-2 border-black mr-1"/>
                <p className="font-bold text-left text-lg">{f.name}</p>
              </a>
              {myScore}
            </li>
          );
        }) }
      </ul>
    </section>
  );
}

export default FavoriteGames;