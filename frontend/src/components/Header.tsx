import React from "react";
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import AuthButtons from "./AuthButtons";

function Header() {
  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <Typography variant="h6" sx={{  flexGrow: 1 }}>
          Pizza
        </Typography>
        <AuthButtons />
      </Toolbar>
    </AppBar>
  );
}

export default Header;
