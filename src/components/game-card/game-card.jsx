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
