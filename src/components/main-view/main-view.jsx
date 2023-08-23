import { useState, useEffect } from "react";
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


  const [games, setGames] = useState([]);

  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    fetch("https://vidjagamers-779c791eee4b.herokuapp.com/games")
      .then((response) => response.json())
      .then((data) => {
        console.log("games from api:", data);
        const gamesFromApi = data.map((doc) => {
          return {
            id: doc._id,
            title: doc.title,
            image: doc.image,
            description: doc.description,
            platforms: doc.platform,
            releaseYear: doc.releaseYear,
            developer: doc.developer,
            genres: doc.genre,
            series: doc.series,
            featured: doc.featured,
          };
        });
        console.log("games in array:", gamesFromApi);
        setGames(gamesFromApi);
      });
  }, []);


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