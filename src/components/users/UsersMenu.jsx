import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { IconButton, Menu, MenuItem, Avatar } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import useStore from '../../zustand/store';

export default function UsersMenu({ anchorEl, handleClose, handleClick, logout, profileImageUrl, isLoading, userData }) {
    const avatarUrl = useStore((state) => state.avatarUrl);
    const [localAvatarUrl, setLocalAvatarUrl] = useState(avatarUrl);
    const [avatarKey, setAvatarKey] = useState(0);

    const updateAvatarKey = () => {
        setAvatarKey(prevKey => prevKey + 1);
    };

    useEffect(() => {
        setLocalAvatarUrl(avatarUrl);
        updateAvatarKey();
    }, [avatarUrl]);

    console.log('userData :', userData);
    console.log('Is loading:', isLoading);
    console.log('profileImageUrl:', profileImageUrl);

    return (
        <>
            <IconButton color="inherit" onClick={handleClick}>
                {(!isLoading && (localAvatarUrl || profileImageUrl)) ? (
                    <Avatar key={avatarKey} alt="Profile Image" src={localAvatarUrl || profileImageUrl} />
                ) : (
                    <AccountCircleIcon />
                )}
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose} component={Link} to="/user-profile">
                    Profile
                </MenuItem>
                <MenuItem onClick={handleClose} component={Link} to="/user-setting">
                    Settings
                </MenuItem>
                <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
        </>
    )
}
