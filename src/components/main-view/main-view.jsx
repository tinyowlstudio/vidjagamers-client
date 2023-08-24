import { useState, useEffect } from "react";
import { GameCard } from "../game-card/game-card";
import { GameView } from "../game-view/game-view";
import { LoginView } from "../login-view/login-view"
import { SignupView } from "../signup-view/signup-view"

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

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");
  const [user, setUser] = useState(storedUser? storedUser : null); //
  const [token, setToken] = useState(storedToken? storedToken : null);

  useEffect(() => {
    if (!token) { //if theres no token, dont execute the rest
      return;
    }

    fetch("https://vidjagamers-779c791eee4b.herokuapp.com/games", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("games from api:", data);
        // const gamesFromApi = data.map((doc) => {
        //   return {
        //     id: doc._id,
        //     title: doc.title,
        //     image: doc.image,
        //     description: doc.description,
        //     platforms: doc.platform,
        //     releaseYear: doc.releaseYear,
        //     developer: doc.developer,
        //     genres: doc.genre,
        //     series: doc.series,
        //     featured: doc.featured,
        //   };
        // });
        //console.log("games in array:", gamesFromApi);
        setGames(data); //this sets games without reformatting like the above code
        //since the API is already in the right format, dont need to reformat the objects
      });
  }, [token]); //dependency array; makes sure a fetch request is made everytime token changes

    //if no user is logged in, go to the login view
    if (!user) {
      return ( 
        <>
        <LoginView
          onLoggedIn={(user, token) => {
            setUser(user); //if the login was successful, set the user so useState isnt null
            setToken(token); //set the token as well
          }}
        />
        or
        <SignupView />
        </>
      ); 
    }

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
    <div>
      {games.map((game) => (
        <GameCard
          key={game._id}
          game={game}
          onGameClick={(newSelectedGame) => {
            setSelectedGame(newSelectedGame); //passes the setSelectedGame to game-card
          }}
        />
      ))}
      {/* logs you out by resetting setUser and setToken to the useState null, also clears local storage for stored items */}
      <button onClick={() => { setUser(null);setToken(null); localStorage.clear();}}>Logout</button> 
    </div>
  );
};