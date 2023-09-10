import { useState, useEffect } from "react";
import { GameCard } from "../game-card/game-card";
import { GameView } from "../game-view/game-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { ProfileView } from "../profile-view/profile-view";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProfileView } from "../profile-view/profile-view";

// Export this component to other files, which determines the look of the component
export const MainView = () => {
  const [games, setGames] = useState([]);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");
  const [user, setUser] = useState(storedUser ? storedUser : null);
  const [token, setToken] = useState(storedToken ? storedToken : null);

  const [selectedCategory, setSelectedCategory] = useState("title");
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) {
      //if theres no token, dont execute the rest
      return;
    }

    fetch("https://vidjagamers-779c791eee4b.herokuapp.com/games", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setGames(data); //this sets games without reformatting
        //since the API is already in the right format, dont need to reformat the objects
      });
  }, [token]);


 // Sort the games by "series" alphabetically with null/undefined values first
 const sortedGames = games.slice().sort((a, b) => {
  // If both have no series or the same series, keep their order
  if (!a.series && !b.series) return 0;
  //check if a or b has no series compared to the other one
  //if they dont, bring them forward on the list
  if (!a.series) return -1; 
  if (!b.series) return 1;  

  // Compare series names alphabetically
  return a.series.localeCompare(b.series);
});


  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearch = (category, text) => {
    setErrorMsg(""); //reset error message if there was one before
  
    setSearchText(text);
    if (!text) {
      return;
    } else if (category === "title") {
      fetch(
        `https://vidjagamers-779c791eee4b.herokuapp.com/games/${text}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          //because a single game returns an object only, not an array
          //of objects, need to put it into an array
          setSearchResults(Array.isArray(data) ? data : [data]);
          console.log("Search Results:"+searchResults);
        }).catch((error) => {
          // Handle API errors here and set an appropriate error message
          setSearchResults([]);
          setErrorMsg(`${category.charAt(0).toUpperCase() + category.slice(1)} ${text} is not found`);
          console.error("Error fetching search results:", error);
        });
    } else {
      fetch(
        `https://vidjagamers-779c791eee4b.herokuapp.com/${category}/${text}/games`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setSearchResults(data);
        }).catch((error) => {
          // Handle API errors here and set an appropriate error message
          setSearchResults([]);
          setErrorMsg(`${category.charAt(0).toUpperCase() + category.slice(1)} ${text} is not found`);
          console.error("Error fetching search results:", error);
        });
    }
  };

  return (
    <BrowserRouter>
      <NavigationBar
        user={user}
        onLoggedOut={() => {
          setUser(null);
          setToken(null);
          localStorage.clear();
        }}
        onSearchCategory={handleCategoryChange}
        onSearch={handleSearch}
      />
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
                    <GameView games={games} user={user} token={token} />
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
                ) : errorMsg ? (
                  <Col>{errorMsg}</Col>
                ) : searchText ? (
                  <>
                    {searchResults.map((game) => (
                      <Col className="mb-4" key={game._id}  sm={6} md={4} lg={3}>
                        <GameCard game={game} user={user} token={token} />
                      </Col>
                    ))}
                  </>
                ) : (
                  <>
                    {sortedGames.map((game) => (
                      <Col className="mb-4" key={game._id} xs={12} md={6} lg={4} xl={3}>
                        <GameCard game={game} user={user} token={token}/>
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
                        onUserUpdate={(updatedData) => setUser(updatedData)}
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
  ); 
};
