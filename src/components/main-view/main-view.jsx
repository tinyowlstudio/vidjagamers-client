import { useState, useEffect } from "react";
import { GameCard } from "../game-card/game-card";
import { GameView } from "../game-view/game-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import Row from "react-bootstrap/Row";
import Col from 'react-bootstrap/Col';
import Button from "react-bootstrap/Button";

// Export this component to other files, which determines the look of the component
export const MainView = () => {

  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");
  const [user, setUser] = useState(storedUser? storedUser : null); 
  const [token, setToken] = useState(storedToken? storedToken : null);

  useEffect(() => {
    if (!token) { //if theres no token, dont execute the rest
      return;
    }

    fetch("https://vidjagamers-779c791eee4b.herokuapp.com/games", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => response.json())
      .then((data) => {;
        setGames(data); //this sets games without reformatting
        //since the API is already in the right format, dont need to reformat the objects
      });
  }, [token]); //dependency array; makes sure a fetch request is made everytime token changes


  return (
    //everything in the component must be wrapped in a single div
    //you cant return two different elements next to each other
    <Row className="justify-content-md-center">
      {!user ? ( //the ? and : work like if-else statements
        <>
          <Col className="login front-section" md={5}>
            <h1>Login</h1>
            <LoginView
              onLoggedIn={(user, token) => {
                setUser(user); //if the login was successful, set the user so useState isnt null
                setToken(token); //set the token as well
              }}
            />
          </Col>
          <Col className="signup front-section" md={5}>
            <h1>Signup</h1>
            <SignupView />
          </Col>
        </>
      ) : selectedGame ? (
        <Col md={12}>
          <GameView
            game={selectedGame}
            onBackClick={() => setSelectedGame(null)}
          />
        </Col>
      ) : games.length === 0 ? (
        <div>The list is empty!</div>
      ) : (
        <div className="game-grid">
          <Row>
            {games.map((game) => (
              <Col className="mb-4" key={game._id} xs={2} sm={4} md={3}>
                <GameCard
                  game={game}
                  onGameClick={(newSelectedGame) => {
                    setSelectedGame(newSelectedGame); //passes the setSelectedGame to game-card
                  }}
                />
              </Col>
            ))}
          </Row>
          {/* logs you out by resetting setUser and setToken to the useState null, also clears local storage for stored items */}
          <Button
              onClick={() => {
                setUser(null);
                setToken(null);
                localStorage.clear();
              }}
            >
              Logout
            </Button>
        </div>
      )}
    </Row>
  ); //idk why it worked when I put another row to nest the game card code
  //without it, each card took up one row instead of 4 per row
};