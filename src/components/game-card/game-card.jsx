import PropTypes from "prop-types";

export const GameCard = ({ game, onGameClick }) => {
  //   return <div>some title</div>;
  //return <div>{game.title}</div>;
  return(
    <div
      onClick={() => {
        onGameClick(game);
      }}
    >
      {game.title}
    </div>
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