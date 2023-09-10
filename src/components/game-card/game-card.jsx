import React from "react";
import PropTypes from "prop-types";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";

export const GameCard = ({ game, user, token  }) => {
  const gameID = game._id;
  const [favorited, setFavorited] = useState(false);

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
        //console.log(favoriteGames);
        if (favoriteGames && favoriteGames.length > 0) {
          if (favoriteGames.find((game) => game === gameID)) {
            setFavorited(true); // Update the favorited to true
          }
        }
      })
      .catch((e) => {
        alert("Cant access favorite games");
        //console.log("Waiting on favoriteGames load");
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
        //console.log(response.status, response.statusText);
        if (response.ok) {
          //alert("Game added");
          // setFavorited(true);
          // console.log("favorited games = " + favorited)
          if (favorited) {
            alert("Game is already on your list");
          } else {
            setFavorited(true);
            //console.log("favorited games = " + favorited);
            //alert("Game added");
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
        //console.log(response.status, response.statusText);
        if (response.ok) {
          // setFavorited(false);
          // console.log("favorited games = " + favorited)
          // alert("Game deleted");
          if (!favorited) {
            alert("Game isn't in your favorites list");
          } else {
            setFavorited(false);
            //console.log("favorited games = " + favorited);
            //alert("Game deleted");
          }
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
        {/* <Link to={`/games/${encodeURIComponent(game._id)}`}>
        <Button variant="link">Open</Button>
        </Link> */}
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
  // onGameClick: PropTypes.func.isRequired
};