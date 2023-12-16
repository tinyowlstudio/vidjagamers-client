import { GameCard } from "../game-card/game-card";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"; 
import { updateUserField } from "../../redux/reducers/user";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button } from "react-bootstrap";

export const ProfileView = ({ games }) => {
  // const [userInfo, setUserInfo] = useState( //set this up since useEffect is async
  //   {username: "",
  //   email: "",
  //   birthday: "",
  //   favoriteGames: []
  // }
  // ); 
  const userInfo = useSelector((state) => state.user);
  //const [checkUser, setUserInfo] =  useState([]);
  const dispatch = useDispatch();
  let favoriteGames;

  
  // useEffect(() => {
  //   //instead of comparing usernames, can't you go straight to the username URL?
  //   //you cant access /users with just the token, you can only access your username
  //   fetch(
  //     `http://204.236.187.144:8080/users/${userInfo.user.username}`,
  //     {
  //       headers: { Authorization: `Bearer ${userInfo.token}` },
  //     }
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setUserInfo(data);
  //     });
  // }, [userInfo]); 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");

  
  if (userInfo.user.favoriteGames && userInfo.user.favoriteGames.length !== 0) {
    favoriteGames = games.filter((g) => userInfo.user.favoriteGames.includes(g._id));
  } else {
    favoriteGames = [];
  }

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

    //if nothing was changed, dont execute the rest
    if (Object.keys(updatedData).length === 0) {
      alert("No changes made.");
      return;
    }

    fetch(
      `http://204.236.187.144:8080/users/${userInfo.user.username}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      }
    )
      .then((response) => {
        if (response.ok) {
          alert("Change successful");
          //need to set everything afterwards so userInfo.user doesnt get messed up for the link
          if (username !== "") {
            dispatch(updateUserField({ field: "username", value: username }));
          }
          //dont store password on state, just send it to server for hashing
          if (email !== "") {
            dispatch(updateUserField({ field: "email", value: email }));
          }
          if (birthday !== "") {
            dispatch(updateUserField({ field: "birthday", value: birthday }));
          }
          console.log(checkUser);
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
      });
  };

  const handleDelete = (event) => {
    fetch(
      `http://204.236.187.144:8080/users/${userInfo.user.username}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
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
            {userInfo.user.username}
          </div>
          <div>
            <b>Email: </b>
            {userInfo.user.email}
          </div>
          <div>
            <b>Birthday: </b>
            {userInfo.user.birthday}
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
          <Button type="submit" className="delete-button" onClick={handleDelete}>
            Delete Account
          </Button>
        </Col>
      </Row>

      <Row className="favorite-games-list">
        <h2>Favorited Games</h2>
        {userInfo.user.favoriteGames && userInfo.user.favoriteGames.length === 0 ? (
          <Col>You have no favorited games. Go add some!</Col>
        ) : (
          <>
            {favoriteGames.map((game) => (
              <Col className="mb-4" key={game._id} xs={12} md={6} lg={4} xl={3}>
                <GameCard game={game}/>
              </Col>
            ))}
          </>
        )}
      </Row>
    </div>
  );
};
