import { Button } from "react-bootstrap";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";

export const GameView = ({ games, user, token }) => {
  const { gameID } = useParams();
  let genreList = "";
  let platformList = "";
  const [favorited, setFavorited] = useState(false);

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

  useEffect(() => {
    fetch(
      `https://vidjagamers-779c791eee4b.herokuapp.com/users/${user.username}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        const favoriteGames = data.favoriteGames;
        if (favoriteGames && favoriteGames.length > 0) {
          if (favoriteGames.find((game) => game === gameID)) {
            setFavorited(true); // Update the favorited to true
          }
        }
      })
      .catch((e) => {
        alert("Cant access favorite games");
      });
  }, [gameID, token, user.username]); //refresh if any of these change

  const handleAddGame = (event) => {
    // this prevents the default behavior of the form which is to reload the entire page
    event.preventDefault();

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
        if (response.ok) {
          if (favorited) {
            alert("Game is already on your list");
          } else {
            setFavorited(true);
          }
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
        if (response.ok) {
          if (!favorited) {
            alert("Game isn't in your favorites list");
          } else {
            setFavorited(false);
          }
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
        {favorited ? (
          <Button type="submit" className="favorite-button" onClick={handleDeleteGame}>
            <FontAwesomeIcon
              icon={faHeart}
              size="lg"
              color="rgb(220, 106, 161)"
            />
          </Button>
        ) : (
          <Button type="submit" className="favorite-button" onClick={handleAddGame}>
            <FontAwesomeIcon icon={farHeart} size="lg" />
          </Button>
        )}
      </div>
      <div className="game-container__content">
        <div>
          <h1>{game.title}</h1>
        </div>
        <div className="grid">
          <div>
            <h3>Series:</h3> {game.series}
          </div>
          <div>
            <h3>Developer:</h3> {game.developer.name}
          </div>
          <div>
            <h3>Genre:</h3> {genreList}
          </div>
          <div>
            <h3>Release Year:</h3> {game.releaseYear}
          </div>
          <div>
            <h3>Platforms:</h3> {platformList}
          </div>
        </div>

        <div>{game.description}</div>
      </div>
      <Link to={`/`}>
        <Button className="back-button">Back</Button>
      </Link>
    </div>
  );
};
