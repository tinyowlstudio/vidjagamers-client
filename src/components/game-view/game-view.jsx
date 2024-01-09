import { Button } from "react-bootstrap";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addFavoriteGame, deleteFavoriteGame } from "../../redux/reducers/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";

export const GameView = ({ games }) => {
  const { gameID } = useParams();
  let genreList = "";
  let platformList = "";
  const userInfo = useSelector((state) => state.user);
  const dispatch = useDispatch();

  //need to see if favorited is on the list, previous if statements kept looping
  const checkFavorited = userInfo.user.favoriteGames.includes(gameID); //returns true or false
  const [favorited, setFavorited] = useState(checkFavorited);

  const game = games.find((g) => g._id === gameID);
  console.log(game)

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

    //as a precaution in case the favorite button fails to acknowledge favorite is true
    if (favorited) {
      alert("Game is already on your list");
      return;
    }

    fetch(
      `http://ALB-CCex-1735832636.us-west-1.elb.amazonaws.com/users/${userInfo.user.username}/games/${gameID}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          "Content-Type": "application/json",
        }, //doesnt need JSON.stringify cause the index.js code already takes the ID from the URL
      }
    )
      .then((response) => {
        if (response.ok) {
          setFavorited(true);
          dispatch(addFavoriteGame({ gameID: gameID }));
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

    //as a precaution in case the favorite button fails to acknowledge favorite is fa;se
    if (!favorited) {
      alert("Game isn't in your favorites list");
      return;
    }

    fetch(
      `http://ALB-CCex-1735832636.us-west-1.elb.amazonaws.com/users/${userInfo.user.username}/games/${gameID}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          "Content-Type": "application/json",
        }, //doesnt need JSON.stringify cause the index.js code already takes the ID from the URL
      }
    )
      .then((response) => {
        if (response.ok) {
          setFavorited(false);
          dispatch(deleteFavoriteGame({ gameID: gameID }));
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
          <Button
            type="submit"
            className="favorite-button"
            onClick={handleDeleteGame}
          >
            <FontAwesomeIcon
              icon={faHeart}
              size="lg"
              color="rgb(220, 106, 161)"
            />
          </Button>
        ) : (
          <Button
            type="submit"
            className="favorite-button"
            onClick={handleAddGame}
          >
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
