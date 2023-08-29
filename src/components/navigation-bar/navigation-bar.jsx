import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

export const NavigationBar = ({user, onLoggedOut}) => {
    return(
    <Navbar expand="lg">
        <Container>
        <Navbar.Brand as={Link} to={`/`}>VidjaGamers</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
          {!user && (
            //whats the point of this if youre redirected to login
            //when there is no user stored anyways?
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/signup">
                  Signup
                </Nav.Link>
              </>
            )}
            {user && (
              <>
              {/* Remove Home link later since its redundant to the brand Home link */}
                <Nav.Link as={Link} to="/" >
                  Home 
                </Nav.Link>
                <Nav.Link as={Link} to="/" >
                  Profile
                </Nav.Link>
                <Nav.Link //logs you out by resetting setUser and setToken to the useState null, also clears local storage for stored items
              onClick={onLoggedOut}
            >Logout</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
        </Container>
    </Navbar>
    );
}