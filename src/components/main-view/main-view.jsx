import { useState } from "react";
import { GameCard } from "../game-card/game-card";
import { GameView } from "../game-view/game-view";

// Export this component to other files, which determines the look of the component
export const MainView = () => {

      //const [books, setBooks] = useState([]);
    // Same code as above, above is a shortform
    // let books = [];
    // const setBooks = function(newBookList){
    //   books = newBooksList;
    // };


  const [games, setGames] = useState([
    { id: 1, title: "God of War Ragnarok", image: "https://m.media-amazon.com/images/I/81Pagnfx1DL._AC_UF1000,1000_QL80_.jpg", developer: "Santa Monica Studio", genres: ["Action-Adventure","Hack and Slash"], platforms: ["PS4","PS5"], releaseYear: 2022},
    { id: 2, title: "Guild Wars 2", image: "https://upload.wikimedia.org/wikipedia/en/9/96/Gw2-boxfront.png", developer: "ArenaNet", genres: ["MMORPG"], platforms: ["PC"], releaseYear: 2010 },
    { id: 3, title: "Undertale", image: "https://m.media-amazon.com/images/I/41Dw1jNoVoL.jpg", developer: "Toby Fox", genres: ["Role-playing"], platforms: ["PS4","PS Vita","Nintendo Switch","Xbox One","OS X","PC", "Linux"], releaseYear: 2015 },
  ]);

  const [selectedGame, setSelectedGame] = useState(null);

  if (selectedGame) {
    return (
      <GameView game={selectedGame} onBackClick={() => setSelectedGame(null)}/>
    );
  }

  //if the UI state is empty
  if (games.length === 0) {
    return <div>The list is empty!</div>;
  }

  return (
    //everything in the component must be wrapped in a single div
    //you cant return two different elements next to each other
    // <div>
    //   {games.map((game) => (
    //     //return <div key={game.id}>{game.title}</div>//need key to distinguish similar elements for DOM manipulation with React
    //     <GameCard key={game.id} game={game}/> //pass the book object from the map function to GameCard, could also be gameData={game}
    //   ))}
    // </div>
    <div>
      {games.map((game) => (
        <GameCard
          key={game.id}
          game={game}
          onGameClick={(newSelectedGame) => {
            setSelectedGame(newSelectedGame); //passes the setSelectedGame to game-card
          }}
        />
      ))}
    </div>
  );
};