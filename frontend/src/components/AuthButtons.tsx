import React, { useState } from "react";

import { apiPaths, callProvider, invoke, queryClient, useApi } from "../api";

import Button from "@mui/material/Button";
import LoadingButton from '@mui/lab/LoadingButton'
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ButtonGroup from "@mui/material/ButtonGroup";
import IconButton from "@mui/material/IconButton";
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import AccountIcon from '@mui/icons-material/AccountCircle';
import Typography from "@mui/material/Typography";
import { useMutation } from 'react-query';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Divider } from '@mui/material';

function AuthButtons() {
    const [loginModal, setLoginModal] = useState(false);
    const [registerModal, setRegisterModal] = useState(false);
    // const [providers, setProviders] = useState(null);

    const { data: user } = useApi(apiPaths.me);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [repeatError, setRepeatError] = useState(false);

    const [menuAnchor, setMenuAnchor] = React.useState<Element | null>(null);
    const menuOpen = Boolean(menuAnchor);

    const openMenu = (event: React.MouseEvent<any>) => {
        setMenuAnchor(event.currentTarget);
    };
    const closeMenu = () => {
        setMenuAnchor(null);
    };

    const clearForms = () => {
        setEmail("");
        setPassword("");
        setRepeatPassword("");
    }

    const switchLogin = () => {
        setLoginModal(!loginModal);
        closeMenu();
        clearForms();
    };
    const switchRegister = () => {
        setRegisterModal(!registerModal)
        closeMenu();
        clearForms();
    };

    const login = useMutation(apiPaths.loginByEmail.path, () => invoke(apiPaths.loginByEmail, { email, password }), {
        onSuccess: () => {
            queryClient.invalidateQueries(apiPaths.me.path);
            setLoginModal(false);
        }
    });

    const register = useMutation(apiPaths.loginByEmail.path, async () => {
        setRepeatError(false);
        if (password == repeatPassword) {
            invoke(apiPaths.registerByEmail, { email, password });
        } else {
            setRepeatError(true);
            throw '';
        }
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries(apiPaths.me.path);
            setLoginModal(false);
        }
    });

    const logout = useMutation(apiPaths.logout, () => invoke(apiPaths.logout), {
        onSettled: () => {
            queryClient.invalidateQueries(apiPaths.me.path);
        }
    });

    const ProvidersButtons = () => {
        return (
            <ButtonGroup>
                <IconButton onClick={() => callProvider("github")}><GitHubIcon/></IconButton>
                <IconButton onClick={() => callProvider("google")}><GoogleIcon/></IconButton>
            </ButtonGroup>
        )
    }

    return (
        <>
            <div className="auth-modals">
                <Dialog open={loginModal} onClose={switchLogin}>
                    <DialogTitle>Login</DialogTitle>
                    <DialogContent>
                        <Typography variant="body2">Login with:</Typography>
                        <ProvidersButtons/>
                        <TextField
                            margin="dense"
                            autoFocus
                            id="email"
                            label="E-Mail"
                            type="email"
                            fullWidth
                            variant="standard"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            id="password"
                            label="Password"
                            type="password"
                            fullWidth
                            variant="standard"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <DialogActions>
                            <LoadingButton onClick={() => login.mutate()}
                                           loading={login.isLoading}>Login</LoadingButton>
                        </DialogActions>
                    </DialogContent>
                </Dialog>
                <Dialog open={registerModal} onClose={switchRegister}>
                    <DialogTitle>Register</DialogTitle>
                    <DialogContent>
                        <Typography variant="body2">Register with:</Typography>
                        <ProvidersButtons/>
                        <TextField
                            margin="dense"
                            autoFocus
                            id="email"
                            label="E-Mail"
                            type="email"
                            fullWidth
                            variant="standard"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            id="password"
                            label="Password"
                            type="password"
                            fullWidth
                            variant="standard"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            error={repeatError}
                        />
                        <TextField
                            margin="dense"
                            id="repeat-password"
                            label="Repeat password"
                            type="password"
                            fullWidth
                            variant="standard"
                            value={repeatPassword}
                            onChange={e => setRepeatPassword(e.target.value)}
                            error={repeatError}
                        />
                        <DialogActions>
                            <LoadingButton onClick={() => register.mutate()}
                                           loading={register.isLoading}>Register</LoadingButton>
                        </DialogActions>
                    </DialogContent>
                </Dialog>
            </div>
            <div>
                {user == null ?
                    <ButtonGroup>
                        <Button variant="text" color="inherit" onClick={switchLogin}>
                            Login
                        </Button>
                        <Button variant="text" color="inherit" onClick={switchRegister}>
                            Register
                        </Button>
                    </ButtonGroup>
                    :
                    <>
                        <IconButton
                            onClick={openMenu}
                            color="inherit"
                        >
                            <AccountIcon/>
                        </IconButton>
                        <Menu
                            anchorEl={menuAnchor}
                            open={menuOpen}
                            onClose={closeMenu}>

                            <MenuItem>
                                {user.email}
                            </MenuItem>
                            <Divider/>
                            <MenuItem onClick={() => logout.mutate()} disabled={logout.isLoading}>
                                Logout
                            </MenuItem>
                        </Menu>
                    </>
                }</div>
        </>
    );
}

export default AuthButtons;
