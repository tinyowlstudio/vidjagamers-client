import { useState, useEffect } from "react";
import { GameCard } from "../game-card/game-card";
import { GameView } from "../game-view/game-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { ProfileView } from "../profile-view/profile-view";
import Row from "react-bootstrap/Row";
import Col from 'react-bootstrap/Col';
import Button from "react-bootstrap/Button";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProfileView } from "../profile-view/profile-view";

// Export this component to other files, which determines the look of the component
export const MainView = () => {

  const [games, setGames] = useState([]);
  // const [selectedGame, setSelectedGame] = useState(null);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");
  const [user, setUser] = useState(storedUser? storedUser : null); 
  //const [userInfo, setUserInfo] = useState([]);
  const [token, setToken] = useState(storedToken? storedToken : null);

  useEffect(() => {
    if (!token) { //if theres no token, dont execute the rest
      return;
    }

    fetch("https://vidjagamers-779c791eee4b.herokuapp.com/games", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => response.json())
      .then((data) => {
        setGames(data); //this sets games without reformatting
        //since the API is already in the right format, dont need to reformat the objects
      });
  }, [token]); //dependency array; makes sure a fetch request is made everytime token changes


  return (
    <BrowserRouter>
      <NavigationBar
        user={user}
        onLoggedOut={() => {
          setUser(null);
          setToken(null);
          localStorage.clear();
        }}
      />
      {/* //everything in the component must be wrapped in a single div
    //you cant return two different elements next to each other */}
      <Row className="justify-content-md-center">
        <Routes>
          <Route
            path="/signup"
            element={
              <>
                {user ? (
                  <Navigate to="/" />
                ) : (
                  <Col md={5}>
                    <SignupView />
                  </Col>
                )}
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                {user ? (
                  <Navigate to="/" />
                ) : (
                  <Col md={5}>
                    <LoginView
                      onLoggedIn={(user) => {
                        setUser(user); //if the login was successful, set the user so useState isnt null
                        setToken(token); //set the token as well
                      }}
                    />
                  </Col>
                )}
              </>
            }
          />
          <Route
            path="/games/:gameID" //selected game
            element={
              <>
                {!user ? ( //if no user, redirect to login
                  <Navigate to="/login" replace />
                ) : games.length === 0 ? (
                  <Col>The list is empty!</Col>
                ) : (
                  <Col md={12}>
                    <GameView games={games} user={user} token={token}/>
                  </Col>
                )}
              </>
            }
          />
          <Route
            path="/"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : games.length === 0 ? (
                  <Col>The list is empty!</Col>
                ) : (
                  <>
                    {games.map((game) => (
                      <Col className="mb-4" key={game._id} xs={2} sm={4} md={3}>
                        <GameCard game={game} />
                      </Col>
                    ))}
                  </>
                )}
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : games.length === 0 ? (
                  <Col>The list is empty!</Col>
                ) : (
                  <>
                    <Col md={12}>
                      <ProfileView 
                      user={user} 
                      token={token} 
                      games={games}
                      onLoggedOut={() => {
                        setUser(null);
                        setToken(null);
                        localStorage.clear();
                      }}
                        />
                    </Col>
                  </>
                )}
              </>
            }
          />
        </Routes>
      </Row>
    </BrowserRouter>
  ); //idk why it worked when I put another row to nest the game card code
  //without it, each card took up one row instead of 4 per row
};

