import React from "react";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useSelector, useDispatch } from "react-redux"; 
import { setUser } from "../../redux/reducers/user";

export const LoginView = ({ }) => {
  const user = useSelector((state) => state.user); 
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (event) => {
    // this prevents the default behavior of the form which is to reload the entire page
    event.preventDefault();

    const data = {
      username: username,
      password: password,
    };

    fetch("https://vidjagamers-779c791eee4b.herokuapp.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json()) //changes response to a json object so it can extract the jwt
      .then((data) => {
        if (data.user) {
          dispatch(setUser({ user: data.user, token: data.token }));
        } else {
          alert("Incorrect username and/or password, or user doesn't exist");
        }
      })
      .catch((e) => {
        alert("Something went wrong with login");
      });
  };

  //the form to login
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formUsername">
        <Form.Label>Username:</Form.Label>
        <Form.Control
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength="5"
        />
      </Form.Group>
      <Form.Group controlId="formPassword">
        <Form.Label>Password:</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};
