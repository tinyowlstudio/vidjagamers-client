import PropTypes from "prop-types";
import { Card } from "react-bootstrap";

export const GameCard = ({ game, onGameClick }) => {
  //   return <div>some title</div>;
  //return <div>{game.title}</div>;
  return(
    <Card className="h-100">
    <div
      onClick={() => {
        onGameClick(game);
      }}
    >
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
    </div>
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
  onGameClick: PropTypes.func.isRequired
};