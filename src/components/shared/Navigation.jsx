import React, { useState, useEffect, useRef } from 'react'
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
    TextField,
    Dialog,
    DialogContent,
} from "@mui/material";
import { styled } from '@mui/system';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import useMediaQuery from "@mui/material/useMediaQuery";
import { Menu as MenuIcon } from "@mui/icons-material";
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import CloseIcon from '@mui/icons-material/Close';
import { alpha } from '@mui/material/styles';
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

const Search = styled('div')(({ theme, isSearchExpanded }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: isSearchExpanded ? '100%' : 'auto',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme, isSearchExpanded }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: isSearchExpanded ? 'none' : 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

const drawerWidth = 300;

export default function Navigation() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [searchQuery, setSearchQuery] = useState('');
    const [searchDialogOpen, setSearchDialogOpen] = useState(false);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const searchInputRef = useRef(null);
    const isAuthenticated = useStore((state) => state.isAuthenticated);
    const userData = useUserStore((state) => state.userData);
    const isLoading = useUserStore((state) => state.isLoading);
    const setUserData = useUserStore((state) => state.setUserData);
    const setIsLoading = useUserStore((state) => state.setIsLoading);
    const role = useStore((state) => state.role);
    const token = useStore((state) => state.token);
    const logout = useStore((state) => state.logout);
    const cartItems = useStore((state) => state.cartItems);
    const cartItemCount = Array.isArray(cartItems)
        ? cartItems.reduce((total, item) => total + item.quantity, 0)
        : 0;
    const [cartDrawerOpen, setCartDrawerOpen] = React.useState(false);


    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCartIconClick = () => {
        setCartDrawerOpen(true);
    };

    const handleCloseCartDrawer = () => {
        setCartDrawerOpen(false);
    };

    const handleSearchIconClick = () => {
        setIsSearchExpanded(!isSearchExpanded);
        if (!isSearchExpanded) {
            setTimeout(() => {
                searchInputRef.current.focus();
            }, 100);
        }
    };

    //*SearchBar Handler
    const handleSearch = (event) => {
        const query = event.target.value;
        console.log("Search query:", query);
        // Fetch data or perform any action based on the query
    };

    //*Handling closing and opening of the searchBar
    const handleSearchDialogOpen = () => {
        setSearchDialogOpen(true);
    };

    const handleSearchDialogClose = () => {
        setSearchDialogOpen(false);
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
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {

                setIsLoading(false);
            }
        };
        if (isAuthenticated) {
            fetchUserData();

        }
    }, [isAuthenticated]);

    // Simulate data fetching for the search bar
    useEffect(() => {
        if (searchQuery) {
            // Replace this with the actual function to fetch data based on the search query
            const fetchData = async () => {
                console.log(`Fetching data for query: ${searchQuery}`);
            };

            fetchData();
        }
    }, [searchQuery]);

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
                <ListItem button onClick={handleDrawerToggle} component={Link}>
                    Logout
                </ListItem>
            )}

            <ListItem button onClick={handleDrawerToggle} component={Link} to="/payment">
                Payment
            </ListItem>

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
            <AppBar position="static" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
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
                    
                    <Hidden mdUp>
                        <IconButton color="inherit" onClick={handleSearchDialogOpen}>
                            <Hidden smDown>
                                <Search isSearchExpanded={isSearchExpanded}>
                                    <SearchIconWrapper
                                        isSearchExpanded={isSearchExpanded}
                                        onClick={handleSearchIconClick}>

                                        <SearchIcon />
                                    </SearchIconWrapper>
                                    <StyledInputBase
                                        ref={searchInputRef}
                                        placeholder="Search…"
                                        inputProps={{ 'aria-label': 'search' }}
                                        onChange={handleSearch}
                                    />
                                </Search>
                            </Hidden>
                            <SearchIcon />
                        </IconButton>

                    </Hidden>
                    <Hidden smDown>

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

                        <Button color="inherit" component={Link} to="/payment">
                            Payment
                        </Button>

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

            <Dialog
                open={searchDialogOpen}
                // onClose={handleSearchDialogClose}
                fullWidth
            >
                <DialogContent>
                    <Paper
                        component="form"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '2px 4px',
                            marginBottom: theme.spacing(2),
                        }}
                    >
                        <IconButton
                            color="primary"
                            onClick={handleSearchDialogClose}
                        >
                            <SearchIcon />
                        </IconButton>
                        <TextField
                            fullWidth
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                            onChange={handleSearch}
                        />
                        <IconButton
                            color="secondary"
                            onClick={handleSearchDialogClose}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Paper>
                </DialogContent>
            </Dialog>

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
