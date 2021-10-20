import React from "react";
import { render } from "react-dom";
import Header from "./components/Header";

function Application() {
  return (
    <>
      <Header />
      <></>
    </>
  );
}

render(<Application />, document.querySelector(".root"));
