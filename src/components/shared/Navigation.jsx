import React, { useState, useEffect, useRef } from 'react'
import { Link } from "react-router-dom";
import {
    Hidden,
    Avatar,
    useTheme,
    Drawer,
    ListItem,
    List,
    AppBar,
    Button,
    Container,
    Toolbar,
    Tooltip,
    IconButton,
    Box,
    Typography,
    Menu,
    MenuItem,
    TextField,
    Dialog,
    DialogContent,
} from "@mui/material";
import AdbIcon from '@mui/icons-material/Adb';
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

import useStore from '../../zustand/store';
import UsersMenu from '../users/UsersMenu';

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

const drawerWidth = 240;

export default function Navigation() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchDialogOpen, setSearchDialogOpen] = useState(false);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const searchInputRef = useRef(null);
    const isAuthenticated = useStore((state) => state.isAuthenticated);
    const role = useStore((state) => state.role);
    const logout = useStore((state) => state.logout);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
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

    // Profile image URL from the backend
    useEffect(() => {
        // Replace this with the actual function to fetch the profile image URL from the backend
        const fetchProfileImage = async () => {
            // ...fetch profile image URL and update the state
            setProfileImageUrl(null);
            setIsLoading(false);
        };

        fetchProfileImage();
    }, []);

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

            <ListItem button onClick={handleDrawerToggle} component={Link} to="/cart">
                Cart <ShoppingCartIcon />
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
            <AppBar position="static">
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
                            <Typography variant="h6" component="div">
                                My App
                            </Typography>
                        </BrandContainerCentered>
                    </Hidden>
                    <Hidden only={['xs', 'sm']}>
                        <BrandContainer>
                            <Avatar alt="Brand Logo" sx={{ marginRight: theme.spacing(1) }}>
                                Logo
                            </Avatar>
                            <Typography variant="h6" component="div">
                                My App
                            </Typography>
                        </BrandContainer>

                    </Hidden>
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
                    <Hidden mdUp>
                        <IconButton color="inherit" onClick={handleSearchDialogOpen}>
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
                                anchorEl={anchorEl}
                                handleClose={handleClose}
                                logout={logout}
                                profileImageUrl={profileImageUrl}
                                isLoading={isLoading}
                                handleClick={handleClick} />
                        )}


                        {isAuthenticated && role === 'admin' && (
                            <Button color="inherit" component={Link} to="/admin">
                                Admin
                            </Button>
                        )}

                    </Hidden>
                    <IconButton color="inherit" component={Link} to="/cart">
                        <ShoppingCartIcon />
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
                onClose={handleSearchDialogClose}
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
        </>
    );
};
