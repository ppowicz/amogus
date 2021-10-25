import React from "react";
import { render } from "react-dom";
import Header from "./components/Header";
import Container from "@mui/material/Container";

function Application() {
  return (
    <>
      <Header />
      <Container>::content::</Container>
    </>
  );
}

render(<Application />, document.querySelector(".root"));
