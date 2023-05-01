// components/MenuList.js
import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PeopleIcon from '@mui/icons-material/People';

const menuItems = [
    { text: 'Orders', icon: <ShoppingCartIcon /> },
    { text: 'Products', icon: <StorefrontIcon /> },
    { text: 'Customers', icon: <PeopleIcon /> },
];

const MenuList = ({ onItemClick }) => {
    return (
        <List>
            {menuItems.map((item, index) => (
                <ListItem button key={index} onClick={() => onItemClick(item.text)}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                </ListItem>
            ))}
        </List>
    );
};

export default MenuList;
