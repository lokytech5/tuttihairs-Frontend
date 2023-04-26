import React from 'react';
import { Link } from "react-router-dom";
import { IconButton, Menu, MenuItem, Avatar } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


export default function UsersMenu({ anchorEl, handleClose, handleClick, logout, profileImageUrl, isLoading }) {
    console.log('Profile image URL:', profileImageUrl);
    console.log('Is loading:', isLoading);
    return (
        <>
            <IconButton color="inherit" onClick={handleClick}>
                {profileImageUrl && !isLoading ? (
                    <Avatar alt="Profile Image" src={profileImageUrl} />
                ) : (
                    <AccountCircleIcon />
                )}
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose} component={Link} to="/profile">
                    Profile
                </MenuItem>
                <MenuItem onClick={handleClose} component={Link} to="/settings">
                    Settings
                </MenuItem>
                <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
        </>
    )
}
