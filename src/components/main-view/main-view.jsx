import { useState, useEffect } from "react";
import { GameCard } from "../game-card/game-card";
import { GameView } from "../game-view/game-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { ProfileView } from "../profile-view/profile-view";
import { useSelector, useDispatch } from "react-redux";
import { store, persistor } from "../../redux/store";
import { setUser } from "../../redux/reducers/user";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProfileView } from "../profile-view/profile-view";

// Export this component to other files, which determines the look of the component
export const MainView = () => {
  const [games, setGames] = useState([]);
  const userObj = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState("title");
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    persistor.subscribe(() => {
      // Check if the state has been rehydrated
      if (persistor.getState().bootstrapped) {
        const rehydratedUserObj = useSelector((state) => state.user);
        console.log("Rehydrated:", rehydratedUserObj);
        dispatch(setUser(rehydratedUserObj));
      }
    });
  }, []);
  
  useEffect(() => {
    if (!userObj.token) {
      //if theres no token, dont execute the rest
      return;
    }
    fetch("https://vidjagamers-779c791eee4b.herokuapp.com/games", {
      headers: { Authorization: `Bearer ${userObj.token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setGames(data); //this sets games without reformatting
        //since the API is already in the right format, dont need to reformat the objects
      });
  }, [userObj.token, userObj.user]);

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

    //set text to lowercase to make things case insensitive
    //the fields will be set as lowercase in the if/else statements
    const searchTextLower = text.toLowerCase();

    setSearchText(text);
    if (!text) {
      setSearchResults(sortedGames);
    } else {
      const filteredGames = games.filter((game) => {
        if (category === "releaseYear") {
          const numYear = Number(text);
          return game.releaseYear === numYear; //cant do includes cause field isnt a string
        } else if (category === "developer") {
          //developer is an object
          const fieldLowerCase = game.developer.name.toLowerCase();
          return fieldLowerCase.includes(searchTextLower);
        } else if (category === "genre") {
          //genre is an array of objects
          const foundGenre = game.genre.some((genre) =>
            genre.name.toLowerCase().includes(searchTextLower)
          );
          return foundGenre;
        } else if (category === "platform") {
          //platform is an array of strings
          return game.platform.some((platform) =>
            platform.toLowerCase().includes(searchTextLower)
          );
        } else if (category === "series") { //series might sometimes be null
          return game.series && game.series.toLowerCase().includes(searchTextLower);
        } else { //its just title left now
          const fieldLowerCase = game[category].toLowerCase();
          return fieldLowerCase.includes(searchTextLower);
        }
      });
      if (filteredGames.length === 0) {
        setErrorMsg(`No results for ${category} ${text}`);
      }

      setSearchResults(filteredGames);
    }
  };

  return (
    <BrowserRouter>
      <NavigationBar
        onSearchCategory={handleCategoryChange}
        onSearch={handleSearch}
      />
      <Row className="justify-content-md-center">
        <Routes>
          <Route
            path="/signup"
            element={
              <>
                {userObj.user ? (
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
                {userObj.user ? (
                  <Navigate to="/" />
                ) : (
                  <Col md={5}>
                    <LoginView/>
                  </Col>
                )}
              </>
            }
          />
          <Route
            path="/games/:gameID" //selected game
            element={
              <>
                {!userObj.user ? ( //if no user, redirect to login
                  <Navigate to="/login" replace />
                ) : games.length === 0 ? (
                  <Col>The list is empty!</Col>
                ) : (
                  <Col md={12}>
                    <GameView
                      games={games}
                    />
                  </Col>
                )}
              </>
            }
          />
          <Route
            path="/"
            element={
              <>
                {!userObj.user ? (
                  <Navigate to="/login" replace />
                ) : games.length === 0 ? (
                  <Col>The list is empty!</Col>
                ) : errorMsg ? (
                  <Col>{errorMsg}</Col>
                ) : searchText ? (
                  <>
                    {searchResults.map((game) => (
                      <Col className="mb-4" key={game._id} sm={6} md={4} lg={3}>
                        <GameCard
                          game={game}
                        />
                      </Col>
                    ))}
                  </>
                ) : (
                  <>
                    {sortedGames.map((game) => (
                      <Col
                        className="mb-4"
                        key={game._id}
                        xs={12}
                        md={6}
                        lg={4}
                        xl={3}
                      >
                        <GameCard
                          game={game}
                        />
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
                {!userObj.user ? (
                  <Navigate to="/login" replace />
                ) : games.length === 0 ? (
                  <Col>The list is empty!</Col>
                ) : (
                  <>
                    <Col md={12}>
                      <ProfileView
                        games={games}
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
