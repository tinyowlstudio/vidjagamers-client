import React from "react";
import PropTypes from "prop-types";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { addFavoriteGame, deleteFavoriteGame } from "../../redux/reducers/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";

export const GameCard = ({ game }) => {
  const gameID = game._id;
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user);

    //need to see if favorited is on the list, previous if statements kept looping
    const checkFavorited = userInfo.user.favoriteGames.includes(gameID); //returns true or false
    const [favorited, setFavorited] = useState(checkFavorited);

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
          dispatch(addFavoriteGame({ gameID: gameID}));
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


  return(
    <Card className="game-card" as={Link} to={`/games/${encodeURIComponent(game._id)}`}>
      <Card.Img variant="top" src={game.image} />
      <Card.Body>
        <Card.Title>
         <h2>{game.title}</h2> 
        </Card.Title>
        <Card.Text>
          { game.series ? (<>Series: {game.series} <br /></>) : ""}
          {game.developer.name}
        </Card.Text>
      </Card.Body>
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
    </Card>
  );
};

GameCard.propTypes ={
  game: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    image: PropTypes.string,
    description: PropTypes.string,
    platforms: PropTypes.arrayOf(PropTypes.string),
    releaseYear: PropTypes.number,
    developer: PropTypes.shape({
      name: PropTypes.string,
      foundedYear: PropTypes.number,
      description: PropTypes.string,
    }),
    genre: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        description: PropTypes.string
      })
    ),
  }).isRequired,
};