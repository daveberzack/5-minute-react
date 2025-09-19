import AllGames from "./AllGames";
import FavoriteGames from "./FavoriteGames"

function Games() {

  return (
    <section id="games">
      <FavoriteGames />
      <h2>All Games</h2> 
      <AllGames />
    </section>
  );

}

export default Games;