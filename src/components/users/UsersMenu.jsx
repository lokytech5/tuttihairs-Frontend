import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { IconButton, Menu, MenuItem, Avatar } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import useStore from '../../zustand/store';
import useOrder from '../../hooks/useOrder';
import useUserStore from '../../zustand/userStore';

export default function UsersMenu({ anchorEl, handleClose, handleClick, logout, profileImageUrl, isLoading }) {
    const avatarUrl = useStore((state) => state.avatarUrl);
    const userData = useUserStore((state) => state.userData);
    const userId = userData ? userData._id : null; 
    const [localAvatarUrl, setLocalAvatarUrl] = useState(avatarUrl);
    const [avatarKey, setAvatarKey] = useState(0);
    const { fetchOrdersByUserId } = useOrder(); // destructure fetchOrdersByUserId from useOrder
    const [hasOrders, setHasOrders] = useState(false); // state variable to store user orders
   

    const updateAvatarKey = () => {
        setAvatarKey(prevKey => prevKey + 1);
    };

    useEffect(() => {
        setLocalAvatarUrl(avatarUrl);
        updateAvatarKey();
    }, [avatarUrl]);
    

    useEffect(() => {
        const fetchOrders = async () => {
            const result = await fetchOrdersByUserId(userId);
            if (result && result.orders && result.orders.length > 0) {
                setHasOrders(true);
            } else {
                setHasOrders(false);
            }
        };

        if (userId) {
            fetchOrders();
        }
    }, [userId, fetchOrdersByUserId]);
    

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

                {hasOrders && (
                    <MenuItem onClick={handleClose} component={Link} to="/user-orders">
                        Orders
                    </MenuItem>
                )}

                <MenuItem onClick={handleClose} component={Link} to="/user-setting">
                    Settings
                </MenuItem>
                <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
        </>
    )
}
