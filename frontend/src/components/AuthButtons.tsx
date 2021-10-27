import React, { useState, useEffect } from "react";
import axios from "axios";

import { apiPaths,  getCurrentUser,  login, register, callProvider } from "../api";
import IUser from "~/interfaces/IUser";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ButtonGroup from "@mui/material/ButtonGroup";
import IconButton from "@mui/material/IconButton";
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import Typography from "@mui/material/Typography";

function AuthButtons() {
  const [loginModal, setLoginModal] = useState(false);
  const [registerModal, setRegisterModal] = useState(false);
  const [user, setUser] = useState<IUser>(null!);
  const [providers, setProviders] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [repeatError, setRepeatError] = useState(false);

  const switchLogin = () => setLoginModal(!loginModal);
  const switchRegister = () => setRegisterModal(!registerModal);

  const doLogin = () => {
    login(email, password);
  };
  const doRegister = () => {
    setRepeatError(false);
    if (password == repeatPassword) {
      register(email, password);
    } else {
      setRepeatError(true);
    }
  };

  const logout = () => {
    axios.get(apiPaths.logout).then(() => {
      window.location.reload();
    }).catch(error => console.warn(error));
  }

  useEffect(() => {
    getCurrentUser().then(u => {
      setUser(u!)
      console.log(u)
    });

    // getProviders().then(p => {
    //   setProviders(p);
    //   console.log(p);
    // })
  }, [])

  return (
    <>
      <div className="auth-modals">
        <Dialog open={loginModal} onClose={switchLogin}>
          <DialogTitle>Login</DialogTitle>
          <DialogContent>
            <Typography variant="body2">Login with:</Typography>
            <ButtonGroup>
              <IconButton onClick={() => callProvider("github")}><GitHubIcon /></IconButton>
              <IconButton onClick={() => callProvider("google")}><GoogleIcon /></IconButton>
            </ButtonGroup>
            <TextField
              margin="dense"
              autoFocus
              id="email"
              label="E-Mail"
              type="email"
              fullWidth
              variant="standard"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <TextField
              margin="dense"
              id="password"
              label="Password"
              type="password"
              fullWidth
              variant="standard"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <DialogActions>
              <Button onClick={doLogin}>Login</Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
        <Dialog open={registerModal} onClose={switchRegister}>
          <DialogTitle>Register</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              autoFocus
              id="email"
              label="E-Mail"
              type="email"
              fullWidth
              variant="standard"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <TextField
              margin="dense"
              id="password"
              label="Password"
              type="password"
              fullWidth
              variant="standard"
              value={password}
              onChange={e => setPassword(e.target.value)}
              error={repeatError}
            />
            <TextField
              margin="dense"
              id="repeat-password"
              label="Repeat password"
              type="password"
              fullWidth
              variant="standard"
              value={repeatPassword}
              onChange={e => setRepeatPassword(e.target.value)}
              error={repeatError}
            />
            <DialogActions>
              <Button onClick={doRegister}>Register</Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </div>
      <div className="auth-buttons">
        {user == null ?
          <ButtonGroup>
            <Button variant="text" color="inherit" onClick={switchLogin}>
              Login
            </Button>
            <Button variant="text" color="inherit" onClick={switchRegister}>
              Register
            </Button>
          </ButtonGroup>
        :
          <ButtonGroup>
            <Button variant="text" color="inherit">
              {user.Email}
            </Button>
            <Button variant="text" color="inherit" onClick={logout}>
              Logout
            </Button>
          </ButtonGroup>
      }
      </div>
    </>
  );
}

export default AuthButtons;
