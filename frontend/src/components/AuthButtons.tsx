import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ButtonGroup from "@mui/material/ButtonGroup";

function AuthButtons() {
  const [loginModal, setLoginModal] = useState(false);
  const [registerModal, setRegisterModal] = useState(false);

  const switchLogin = () => setLoginModal(!loginModal);
  const switchRegister = () => setRegisterModal(!registerModal);

  return (
    <>
      <div className="auth-modals">
        <Dialog open={loginModal} onClose={switchLogin}>
          <DialogTitle>Login</DialogTitle>
          <DialogContent>
            <DialogContentText>Login in to your account</DialogContentText>
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
              <Button onClick={switchLogin}>Login</Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
        <Dialog open={registerModal} onClose={switchRegister}>
          <DialogTitle>Register</DialogTitle>
          <DialogContent>
            <DialogContentText>Create a new account</DialogContentText>
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
              <Button onClick={switchRegister}>Register</Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </div>
      <div className="auth-buttons">
        <ButtonGroup>
          <Button variant="outlined" onClick={switchLogin}>
            Login
          </Button>
          <Button variant="outlined" onClick={switchRegister}>
            Register
          </Button>
        </ButtonGroup>
      </div>
    </>
  );
}

export default AuthButtons;