import { Button } from "react-bootstrap";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

export const GameView = ({ games, user, token }) => {
  const { gameID } = useParams();
  let genreList = "";
  let platformList = "";

  const game = games.find((g) => g._id === gameID);

  game.genre.forEach((genre, index) => {
    //check if it's not the last in the list for the comma
    if (index !== game.genre.length - 1) {
      genreList += genre.name + ", ";
    } else {
      genreList += genre.name; // if its the last, no comma
    }
  });

  game.platform.forEach((platform, index) => {
    //check if it's not the last in the list for the comma
    if (index !== game.platform.length - 1) {
      platformList += platform + ", ";
    } else {
      platformList += platform; // if its the last, no comma
    }
  });

  const handleAddGame = (event) => {
    // this prevents the default behavior of the form which is to reload the entire page
    event.preventDefault();
    // fetch(
    //   `https://vidjagamers-779c791eee4b.herokuapp.com/users/${user.username}`,
    //   {
    //     headers: { Authorization: `Bearer ${token}` },
    //   }
    // )
    //   .then((response) => response.json())
    //   .then((data) => {
    //     const favoriteGames = data.favoriteGames;
    //     console.log(favoriteGames);
    //     if (favoriteGames && favoriteGames.length > 0){
    //       if (favoriteGames.find(game => game === gameID)) {
    //         alert("Game is already favorited");
    //         return;
    //       }
    //     }
    //   })
    //   .catch((e) => {
    //     alert("Cant access favorite games");
    //   });


    fetch(
      `https://vidjagamers-779c791eee4b.herokuapp.com/users/${user.username}/games/${gameID}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }, //doesnt need JSON.stringify cause the index.js code already takes the ID from the URL
      }
    )
      .then((response) => {
        //console.log(response.status, response.statusText);
        if (response.ok) {
          alert("Game added");
        } else {
          alert("Unable to add game");
        }
      })
      .catch((e) => {
        alert("Something went wrong");
      });
  };

  const handleDeleteGame = (event) => {
    // this prevents the default behavior of the form which is to reload the entire page
    event.preventDefault();

    fetch(
      `https://vidjagamers-779c791eee4b.herokuapp.com/users/${user.username}/games/${gameID}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }, //doesnt need JSON.stringify cause the index.js code already takes the ID from the URL
      }
    )
      .then((response) => {
        //console.log(response.status, response.statusText);
        if (response.ok) {
          alert("Game deleted");
          // if(!favoriteGames.find(game => game === gameID)){
          //   alert("Game isn't in your favorites list");
          // }else{
          //   alert("Game deleted");
          // }
        } else {
          alert("Unable to delete game");
        }
      })
      .catch((e) => {
        alert("Something went wrong");
      });
  };

  return (
    <div className="game-container">
      <div className="game-container__image">
        <img src={game.image}></img>
      </div>
      <div className="game-container__content">
        <div>
          <h2>{game.title}</h2>
        </div>
        <div>
          <h3>Series:</h3> {game.series}
        </div>
        <div>
          <h3>Description:</h3> {game.description}
        </div>
        <div>
          <h3>Developer:</h3> {game.developer.name}
        </div>
        <div>
          <h3>Genre:</h3> {genreList}
        </div>
        <div>
          <h3>Platforms:</h3> {platformList}
        </div>
        <div>
          <h3>Release Year:</h3> {game.releaseYear}
        </div>
      </div>
      <Link to={`/`}>
        <Button className="back-button">Back</Button>
      </Link>

      <Button type="submit" onClick={handleAddGame}>
        Add Game to Favorites
      </Button>
      <Button type="submit" onClick={handleDeleteGame}>
        Delete Game from Favorites
      </Button>
    </div>
  );
};
