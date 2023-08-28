import { Button } from "react-bootstrap";

export const GameView = ({ game, onBackClick }) => {
    let genreList = "";
    let platformList ="";
    
    game.genre.forEach((genre, index)=>{
        //check if it's not the last in the list for the comma
        if (index !== game.genre.length - 1) {
            genreList += genre.name + ", ";
          } else {
            genreList += genre.name; // if its the last, no comma
          }
    });

    game.platform.forEach((platform, index)=>{
        //check if it's not the last in the list for the comma
        if (index !== game.platform.length - 1) {
            platformList += platform + ", ";
          } else {
            platformList += platform; // if its the last, no comma
          }
    });

  return (
    <div className="game-container">
      <div className="game-container__image">
        <img src={game.image}></img>
      </div>
      <div className="game-container__content">
      <div><h2>{game.title}</h2></div>
      <div><h3>Series:</h3> {game.series}</div>
      <div><h3>Description:</h3> {game.description}</div>
      <div><h3>Developer:</h3> {game.developer.name}</div>
      <div><h3>Genre:</h3> {genreList}</div>
      <div><h3>Platforms:</h3> {platformList}</div>
      <div><h3>Release Year:</h3> {game.releaseYear}</div>
</div>
      <Button onClick={onBackClick}>Back</Button>
    </div>
  );
};
