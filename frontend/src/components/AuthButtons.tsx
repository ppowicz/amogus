import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiPaths } from "../api";

import IUser from "~/interfaces/IUser";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ButtonGroup from "@mui/material/ButtonGroup";


function AuthButtons() {
  const [loginModal, setLoginModal] = useState(false);
  const [registerModal, setRegisterModal] = useState(false);
  const [user, setUser] = useState<IUser>(null!);

  const switchLogin = () => setLoginModal(!loginModal);
  const switchRegister = () => setRegisterModal(!registerModal);

  const doLogin = () => switchLogin(); // TODO
  const doRegister = () => switchRegister(); // TODO

  const logout = () => {
    axios.get(apiPaths.logout).then(() => {
      window.location.reload();
    }).catch(error => console.warn(error));
  }
  const getCurrentUser = () => {
    axios.get(apiPaths.me).then(response => {
      setUser(response.data);
    }).catch(error => console.warn(error));
  }

  useEffect(() => getCurrentUser(), [])

  return (
    <>
      <div className="auth-modals">
        <Dialog open={loginModal} onClose={switchLogin}>
          <DialogTitle>Login</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              autoFocus
              id="email"
              label="E-Mail"
              type="email"
              fullWidth
              variant="standard"
            />
            <TextField
              margin="dense"
              id="password"
              label="Password"
              type="password"
              fullWidth
              variant="standard"
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
            />
            <TextField
              margin="dense"
              id="password"
              label="Password"
              type="password"
              fullWidth
              variant="standard"
            />
            <TextField
              margin="dense"
              id="repeat-password"
              label="Repeat password"
              type="password"
              fullWidth
              variant="standard"
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
