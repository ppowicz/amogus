import React from "react";
import { render } from "react-dom";

import Main from "./views/Main";

import Header from "./components/Header";

function Application() {
  return (
    <>
      <Header />
      <Main />
    </>
  );
}

render(
  <Application />,
  document.querySelector(".root")
);
