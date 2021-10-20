import React from "react";
import { render } from "react-dom";

function Application() {
  return <h1>App</h1>;
}

render(<Application />, document.querySelector(".root"));
