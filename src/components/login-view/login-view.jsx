import React from "react";
import { useState } from "react";

export const LoginView = ({ onLoggedIn }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const handleSubmit = (event) => {
      // this prevents the default behavior of the form which is to reload the entire page
      event.preventDefault();
  
      const data = {
        username: username,
        password: password
      };
  
      fetch("https://vidjagamers-779c791eee4b.herokuapp.com/login", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
      },
        body: JSON.stringify(data)
      }).then((response) => response.json()) //changes response to a json object so it can extract the jwt
      .then((data) => {
        console.log("Login response: ", data);
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
          onLoggedIn(data.user, data.token); //pass user and token back to MainView so any API requests can see it
        } else {
          alert("No such user");
        }
      })
      .catch((e) => {
        alert("Something went wrong");
      });
    };

  
    //the form to login
    return (
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}required minLength={5}
        />
        </label>
        <label>
          Password:
          <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}required 
        />
        </label>
        <button type="submit">
          Submit
        </button>
      </form>
    );
  };