import { GameCard } from "../game-card/game-card";
import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { FormGroup } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button } from "react-bootstrap";

export const ProfileView = ({ user, token, games, onUserUpdate, onLoggedOut }) => {
  //const { username } = useParams();
  const [userInfo, setUserInfo] = useState( //set this up since useEffect is async
    {username: "",
    email: "",
    birthday: "",
    favoriteGames: []
  }
  ); 
  let favoriteGames;

  
  useEffect(() => {
    //instead of comparing usernames, can't you go straight to the username URL?
    //you cant access /users with just the token, you can only access your username
    fetch(
      `https://vidjagamers-779c791eee4b.herokuapp.com/users/${user.username}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        //console.log(data);
        setUserInfo(data);
        
      });
  }, []); 
  //console.log(userInfo.favoriteGames);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");

  
  if (userInfo.favoriteGames && userInfo.favoriteGames.length !== 0) {
    favoriteGames = games.filter((g) => userInfo.favoriteGames.includes(g._id));
  } else {
    favoriteGames = [];
  }

  //console.log(favoriteGames);

  const handleUpdate = (event) => {
    // this prevents the default behavior of the form which is to reload the entire page
    event.preventDefault();

    //have an empty array and place things inside if
    //they exist in the fields
    const updatedData = {};

    if (username !== "") {
      updatedData.username = username;
    }
    if (password !== "") {
      updatedData.password = password;
    }
    if (email !== "") {
      updatedData.email = email;
    }
    if (birthday !== "") {
      updatedData.birthday = birthday;
    }

    //console.log(updatedData);
    //if nothing was changed, dont execute the rest
    if (Object.keys(updatedData).length === 0) {
      alert("No changes made.");
      return;
    }

    fetch(
      `https://vidjagamers-779c791eee4b.herokuapp.com/users/${user.username}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      }
    )
      .then((response) => {
        //console.log("Update response: ", updatedData);
        if (response.ok) {
          alert("Change successful");
          onUserUpdate(updatedData); //update user 
          //setUserInfo(updatedData);
          //console.log(user);

          //reset everything
          setUpdatedData({});
          setUsername("");
          setPassword("");
          setEmail("");
          setBirthday("");
          window.location.reload();
        } else {
          alert("Change was unsuccessful");
        }
      })
      .catch((e) => {
        alert("Something went wrong");
        window.location.reload();
      });
  };

  const handleDelete = (event) => {
    fetch(
      `https://vidjagamers-779c791eee4b.herokuapp.com/users/${user.username}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        //console.log("Delete response: ", udata);
        if (response.ok) {
          alert("Deletion successful");
          window.location.reload();
          onLoggedOut(); //need to remove stored info after deleting the account
        } else {
          alert("Deletion was unsuccessful");
        }
      })
      .catch((e) => {
        alert("Something went wrong");
        window.location.reload();
      });
  };

  return (
    <div>
      <Row>
        <Col md={6}>
          <h2>Profile</h2>
          <div>
            <b>Username: </b>
            {userInfo.username}
          </div>
          <div>
            <b>Email: </b>
            {userInfo.email}
          </div>
          <div>
            <b>Birthday: </b>
            {userInfo.birthday}
          </div>
        </Col>
        <Col md={6}>
          <h2>Reset Info</h2>
          <Form onSubmit={handleUpdate}>
            <Form.Group controlId="formUsername">
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                minLength="5"
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Birthday:</Form.Label>
              <Form.Control
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
              />
            </Form.Group>
            <Button type="submit">Submit</Button>
          </Form>
          <Button type="submit" onClick={handleDelete}>
            Delete Account
          </Button>
        </Col>
      </Row>

      <Row>
        <h2>Favorited Games</h2>
        {userInfo.favoriteGames && userInfo.favoriteGames.length === 0 ? (
          //i dont know why "userInfo.favoriteGames &&" is needed to make this work
          <Col>You have no favorited games. Go add some!</Col>
        ) : (
          <>
            {favoriteGames.map((game) => (
              <Col className="mb-4" key={game._id} xs={2} sm={4} md={3}>
                <GameCard game={game} />
              </Col>
            ))}
          </>
        )}
      </Row>
    </div>
  );
};
