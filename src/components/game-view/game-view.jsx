export const GameView = ({ game, onBackClick }) => {
    let genreList = "";
    let platformList ="";
    
    game.genres.forEach((genre, index)=>{
        //check if it's not the last in the list for the comma
        if (index !== game.genres.length - 1) {
            genreList += genre.name + ", ";
          } else {
            genreList += genre.name; // if its the last, no comma
          }
    });

    game.platforms.forEach((platform, index)=>{
        //check if it's not the last in the list for the comma
        if (index !== game.platforms.length - 1) {
            platformList += platform + ", ";
          } else {
            platformList += platform; // if its the last, no comma
          }
    });

  return (
    <div className="game-container">
      <div className="game-image">
        <img src={game.image}></img>
      </div>
      <div>Title: {game.title}</div>
      <div>Series: {game.series}</div>
      <div>Description: {game.description}</div>
      <div>Developer: {game.developer.name}</div>
      <div>Genre: {genreList}</div>
      <div>Platforms: {platformList}</div>
      <div>Release Year: {game.releaseYear}</div>

      <button onClick={onBackClick}>Back</button>
    </div>
  );
};
