import React from "react";
import { render } from "react-dom";

import Menu from "./views/Menu";

import Header from "./components/Header";
import { QueryClientProvider } from 'react-query';
import { queryClient } from './api';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Admin from "./views/Admin";
import { Container, ThemeProvider } from '@mui/material';
import { theme } from './theme';
import { SnackbarProvider } from 'notistack';
import { GlobalSnackbar } from './components/GlobalSnackbar';
import PrivateRoute, { PrivateElement } from './components/PrivateRoute';
import NotFound from './views/NotFound';

function Application() {
    return (
        <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={3}>
                <GlobalSnackbar />
                <QueryClientProvider client={queryClient}>
                    <BrowserRouter>
                        <Header/>
                        <Container style={{ marginTop: "2em" }}>
                            <Routes>
                                <Route path='/' element={<Menu/>}/>
                                <Route path='/manage' element={<PrivateElement element={<Admin/>} />} />
                                <Route path='*' element={<NotFound />} />
                            </Routes>
                        </Container>
                    </BrowserRouter>
                </QueryClientProvider>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

render(
    <Application/>,
    document.querySelector(".root")
);
