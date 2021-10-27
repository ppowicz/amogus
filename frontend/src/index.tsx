import React from "react";
import { render } from "react-dom";

import Main from "./views/Main";

import Header from "./components/Header";
import MenuItem from "./components/MenuItem"

function Application() {
  return (
    <>
      <Header />
      <Main />
    </>
  );
}

render(<Application />, document.querySelector(".root"));
