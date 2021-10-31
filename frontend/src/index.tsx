import React from "react";
import { render } from "react-dom";

import Main from "./views/Main";

import Header from "./components/Header";
import { QueryClientProvider } from 'react-query';
import { queryClient } from './api';

function Application() {
  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <Main />
    </QueryClientProvider>
  );
}

render(
  <Application />,
  document.querySelector(".root")
);
