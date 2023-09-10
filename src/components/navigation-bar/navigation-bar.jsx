import { useState } from "react";
import {
  Navbar,
  Container,
  Button,
  Nav,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export const NavigationBar = ({
  user,
  onLoggedOut,
  onSearchCategory,
  onSearch,
}) => {
  const [searchCategory, setSearchCategory] = useState("title");
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleCategoryChange = (category) => {
    setSearchCategory(category);
    onSearchCategory(category, () => {
      console.log(searchCategory); // Use a callback to log the updated value
    });
  };

  const handleSearchClick = () => {
    //check if youre not on the home page
    //do this before onSearch
    if (location.pathname !== "/") {
      // Redirect to the home page to search if not there
      navigate("/");
    }

    onSearch(searchCategory, searchText);
    setSearchText("");
  };

  const handleClearSearch = () => {
    //if you search something, clicking the home page 
    //wont reset the search, so need to create a function
    //to add onto it

    //put search text as blank just in case someone typed
    //something into the field, that way you dont accidentally
    //search that text
    setSearchText("");
    //then when the field is blank search because searchResults
    //set it back to sortedGames(default state) when the text field is blank
    onSearch(searchCategory, searchText);
    
  };


  return (
    <Navbar collapseOnSelect expand="md" variant="dark" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to={`/`} onClick={handleClearSearch}>
          VidjaGamers
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {!user && (
            //whats the point of this if youre redirected to login
            //when there is no user stored anyways? just in case there are errors?
            <>
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/signup">
                  Signup
                </Nav.Link>
              </Nav>
            </>
          )}
          {user && (
            <>
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/profile">
                  Profile
                </Nav.Link>
                <Nav.Link //logs you out by resetting setUser and setToken to the useState null, also clears local storage for stored items
                  onClick={onLoggedOut}
                >
                  Logout
                </Nav.Link>
              </Nav>
              <Nav className="search-bar">
                <DropdownButton
                  id="dropdown-basic-button"
                  title={
                    searchCategory.charAt(0).toUpperCase() +
                    searchCategory.slice(1)
                  }
                  onSelect={handleCategoryChange}
                >
                  <Dropdown.Item eventKey="title">Title</Dropdown.Item>
                  <Dropdown.Item eventKey="developer">Developer</Dropdown.Item>
                  <Dropdown.Item eventKey="genre">Genre</Dropdown.Item>
                  <Dropdown.Item eventKey="platform">Platform</Dropdown.Item>
                  <Dropdown.Item eventKey="releaseYear">
                    Release Year
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="series">Series</Dropdown.Item>
                </DropdownButton>
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder={`Search...`}
                />

                <Button onClick={handleSearchClick}>
                  <FontAwesomeIcon icon={faSearch} />
                </Button>
              </Nav>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
