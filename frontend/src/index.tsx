import React from "react";
import { render } from "react-dom";
import { QueryClient, QueryClientProvider } from 'react-query';

import Main from "./views/Main";

import Header from "./components/Header";
import MenuItem from "./components/MenuItem"

const client = new QueryClient();

function Application() {
  return (
    <>
      <Header />
      <Main />
    </>
  );
}

render(
  <QueryClientProvider client={client}>
    <Application />
  </QueryClientProvider>, 
document.querySelector(".root"));
