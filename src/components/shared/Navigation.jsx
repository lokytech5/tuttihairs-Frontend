import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import {
    Hidden,
    Avatar,
    useTheme,
    Drawer,
    ListItem,
    List,
    Badge,
    AppBar,
    Button,
    Toolbar,
    IconButton,
    Typography,
} from "@mui/material";
import { styled } from '@mui/system';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Menu as MenuIcon } from "@mui/icons-material";
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';

import useStore from '../../zustand/store';
import useUserStore from '../../zustand/userStore'
import UsersMenu from '../users/UsersMenu';
import axios from 'axios'

import ShoppingCart from '../cart/ShoppingCart';

const BrandContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    marginRight: theme.spacing(2),
    justifyContent: 'flex-start',
}));

const BrandContainerCentered = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    marginRight: theme.spacing(2),
    justifyContent: 'center',
}));

const drawerWidth = 300;

export default function Navigation() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const theme = useTheme();
    const [avatarUrl, setAvatarUrl] = useState(null);
    const isAuthenticated = useStore((state) => state.isAuthenticated);
    const userData = useUserStore((state) => state.userData);
    const isLoading = useUserStore((state) => state.isLoading);
    const setUserData = useUserStore((state) => state.setUserData);
    const setUserEmail = useStore((state) => state.setUserEmail);
    const setIsLoading = useUserStore((state) => state.setIsLoading);
    const role = useStore((state) => state.role);
    const token = useStore((state) => state.token);
    const logout = useStore((state) => state.logout);
    const cartItems = useStore((state) => state.cartItems);
    const cartItemCount = Array.isArray(cartItems)
        ? cartItems.reduce((total, item) => total + item.quantity, 0)
        : 0;
    const [cartDrawerOpen, setCartDrawerOpen] = React.useState(false);

    useEffect(() => {
        // Invoke the function to fetch the cart items from your Zustand store
        useStore.getState().fetchCartItems();
    }, []);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleClick = (event) => {
        setAnchorEl(event.target);
    };

    const handleCartIconClick = () => {
        setCartDrawerOpen(true);
    };

    const handleCloseCartDrawer = () => {
        setCartDrawerOpen(false);
    };


    //*Fetch user Profile and pass to menu
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/users/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                setUserData(response.data.user);
                console.log("Fetched user data:", response.data);
                setIsLoading(false);
                // Store the avatar URL in the local state using the correct field name
                setAvatarUrl(response.data.user.avatar);
                setUserEmail(response.data.user.email);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {

                setIsLoading(false);
            }
        };
        if (isAuthenticated) {
            fetchUserData();

        }
        // eslint-disable-next-line
    }, [isAuthenticated, token]);

    const CartDrawerHeader = () => {
        return (
            <div style={{ padding: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                <IconButton onClick={handleCloseCartDrawer}>
                    <CloseIcon />
                </IconButton>
            </div>
        );
    };

    const drawerList = (
        <List>
            <ListItem button onClick={handleDrawerToggle} component={Link} to="/">
                Home
            </ListItem>

            <ListItem button onClick={handleDrawerToggle} component={Link} to="/product-list">
                Product
            </ListItem>
            <ListItem button onClick={handleDrawerToggle} component={Link} to="/training">
                Training
            </ListItem>
            <ListItem button onClick={handleDrawerToggle} component={Link} to="/about">
                About us
            </ListItem>

            {!isAuthenticated ? (
                <>
                    <ListItem button onClick={handleDrawerToggle} component={Link} to="/login">
                        Login
                    </ListItem>
                    <ListItem button onClick={handleDrawerToggle} component={Link} to="/register">
                        Register
                    </ListItem>
                </>
            ) : (
                <ListItem button onClick={() => { handleDrawerToggle(); logout(); }}>
                    Logout
                </ListItem>
            )}


            {isAuthenticated && role === 'user' && (
                <ListItem button onClick={handleDrawerToggle} component={Link} to="/profile">
                    Profile  <AccountCircleIcon />
                </ListItem>
            )}

            <ListItem button onClick={() => { handleDrawerToggle(); handleCartIconClick(); }}>
                <Badge badgeContent={cartItemCount} color="error" key={cartItemCount}>
                    <ShoppingCartIcon />
                </Badge>
            </ListItem>

            {isAuthenticated && role === 'admin' && (
                <ListItem button onClick={handleDrawerToggle} component={Link} to="/admin">
                    Admin
                </ListItem>
            )}
        </List>
    );


    return (
        <>
            <AppBar position="static" color='primary' sx={{ zIndex: theme => theme.zIndex.drawer + 1, }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={handleDrawerToggle}
                        sx={{ marginRight: theme.spacing(2) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Hidden only={['md', 'lg', 'xl']}>
                        <BrandContainerCentered>
                            <Avatar alt="Brand Logo" sx={{ marginRight: theme.spacing(1) }}>
                                Logo
                            </Avatar>
                            <Typography variant="h6" component="div" style={{
                                fontFamily: 'Roboto', // Set the custom font
                                fontWeight: 300,
                            }}>
                                Tuti Hairs
                            </Typography>
                        </BrandContainerCentered>
                    </Hidden>
                    <Hidden only={['xs', 'sm']}>
                        <BrandContainer>
                            <Avatar alt="Brand Logo" sx={{ marginRight: theme.spacing(1) }}>
                                Logo
                            </Avatar>
                            <Typography variant="h6" component="div" style={{
                                fontFamily: 'Roboto', // Set the custom font
                                fontWeight: 300,
                            }}>
                                Tuti Hairs
                            </Typography>
                        </BrandContainer>

                    </Hidden>

                    <Hidden smDown>

                        <Button color="inherit" component={Link} to="/product-list">
                            Product
                        </Button>

                        <Button color="inherit" component={Link} to="/training">
                            Training
                        </Button>

                        <Button color="inherit" component={Link} to="/about">
                            About us
                        </Button>

                        {!isAuthenticated && (
                            <>
                                <Button color="inherit" component={Link} to="/login">
                                    Login
                                </Button>
                                <Button color="inherit" component={Link} to="/register">
                                    Register
                                </Button>
                            </>
                        )}

                        {isAuthenticated && role === 'user' && (
                            <UsersMenu
                                key={avatarUrl}
                                anchorEl={anchorEl}
                                handleClose={handleClose}
                                logout={logout}
                                isLoading={isLoading}
                                handleClick={handleClick}
                                userData={userData}
                                profileImageUrl={avatarUrl} />
                        )}


                        {isAuthenticated && role === 'admin' && (
                            <Button color="inherit" component={Link} to="/admin">
                                Admin
                            </Button>
                        )}

                    </Hidden>
                    <IconButton color="inherit" onClick={handleCartIconClick}>
                        <Badge badgeContent={cartItemCount} color="error">
                            <ShoppingCartIcon />
                        </Badge>
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={handleDrawerToggle}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                    },
                }}
            >
                {drawerList}
            </Drawer>



            <Drawer
                anchor="right"
                open={cartDrawerOpen}
                onClose={handleCloseCartDrawer}
                sx={{
                    zIndex: theme => theme.zIndex.appBar - 1,
                    width: drawerWidth,
                    flexShrink: 0,
                    top: '64px', // Adjust the top position of the cart Drawer
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        marginTop: '64px', // Add a margin to the top of the cart Drawer content
                    },
                }}

                ModalProps={{ BackdropProps: { style: { backgroundColor: 'transparent' } } }}
            >
                <CartDrawerHeader />
                <Divider />
                <ShoppingCart onClose={handleCloseCartDrawer} />
                {/* Add a cart summary, continue shopping button, and checkout button here */}
            </Drawer>
        </>
    );
};
