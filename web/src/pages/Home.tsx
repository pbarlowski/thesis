import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/Container";
import { Button, TextField } from "@mui/material";

const Home = () => {
  const navigate = useNavigate();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const [loginError, setLoginError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const onLoginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (loginError) setLoginError(false);
    setLogin(event.target.value.split(" ").join(""));
  };

  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (passwordError) setPasswordError(false);
    setPassword(event.target.value.split(" ").join(""));
  };

  const onLoginPress = () => {
    if (login.length === 0) return setLoginError(true);
    if (password.length === 0) return setPasswordError(true);

    navigate("/dashboard");
  };

  const onRegisterPress = () => {
    if (login.length === 0) return setLoginError(true);
    if (password.length === 0) return setPasswordError(true);

    navigate("/dashboard");
  };

  return (
    <Container position="center" direction="column">
      <TextField
        value={login}
        onChange={onLoginChange}
        error={loginError}
        margin="normal"
        required
        label="Login"
      />
      <TextField
        value={password}
        onChange={onPasswordChange}
        error={passwordError}
        margin="normal"
        required
        label="Password"
      />
      <Button
        onClick={onLoginPress}
        style={{ margin: "8px" }}
        variant="contained"
      >
        Login
      </Button>
      <Button onClick={onRegisterPress}> Register</Button>
    </Container>
  );
};

export default Home;
