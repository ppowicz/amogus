import React, { PropsWithChildren } from "react";
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import AuthButtons from "./AuthButtons";
import { apiPaths, useApi } from '../api';
import { UserRole } from '../interfaces/IUser';
import Button from '@mui/material/Button';
import { Link, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

function NavItem({ to, children }: PropsWithChildren<{ to: string }>) {
    const { pathname } = useLocation();
    return <Button
        variant="contained"
        color={pathname === to ? 'light' : 'primary'}
        disableElevation
        to={to}
        component={Link}
        sx={{ mx: 1 }}
    >
        {children}
    </Button>;
}

function Header() {
    const { data: user } = useApi(apiPaths.me);

    return (
        <AppBar position="static">
            <Toolbar variant='dense'>
                <Typography variant="h6" sx={{ mr: 3 }}>
                    Pizza
                </Typography>
                <NavItem to='/'>
                    Menu
                </NavItem>
                {user && user.role >= UserRole.Admin
                && <NavItem to='/manage'>
					Manage
				</NavItem>}
                <Box sx={{ flexGrow: 1 }}/>
                <AuthButtons/>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
