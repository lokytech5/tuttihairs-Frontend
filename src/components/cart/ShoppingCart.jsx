import React, { useEffect, useCallback } from 'react'
import {
  Box, Button, Divider, Typography, List, ListItem, ListItemText, ListItemAvatar, IconButton, Avatar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import useStore from '../../zustand/store';
import { useNavigate } from 'react-router-dom';

export default function ShoppingCart() {
  const cartItems = useStore((state) => state.cartItems);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const cartSummary = useStore((state) => state.cartSummary);
  const fetchCartSummary = useStore((state) => state.fetchCartSummary);
  const fetchCartItems = useStore((state) => state.fetchCartItems);
  const isAuthenticated = useStore((state) => state.isAuthenticated)
  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      // Redirect to the checkout page or perform any other action required
      navigate('/checkout');
    }
  };

  const handleRemoveFromCart = useCallback(
    (productId) => () => {
      if (!productId) {
        return;
      }
      removeFromCart(productId);
    },
    [removeFromCart]
  );


  useEffect(() => {

    fetchCartItems();
    fetchCartSummary();
  }, [fetchCartItems, fetchCartSummary]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Shopping Cart
      </Typography>
      {(cartItems.length === 0) ? (
        <Typography variant="body1">Your cart is empty.</Typography>
      ) : (
        <List>
          {cartItems.map((item, index) => (

            <React.Fragment key={item.product._id || index}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar
                    alt={item.name}
                    src={item.image} // Assuming the image URL is stored in the 'image' field of the item object
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={item.name}
                  secondary={`Price: $${item.price} x ${item.quantity}`}
                />

                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={handleRemoveFromCart(item.product._id)}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              </ListItem>
              {index !== cartItems.length - 1 && <Divider />} {/* Add Divider between items */}
            </React.Fragment>
          ))}
        </List>
      )}

      <Box mt={2}>
        <Typography variant="h6">Total Price: ${(cartSummary.totalPrice || 0).toFixed(2)}</Typography>
      </Box>

      <Box mt={2}>
        <Button variant="contained" color="primary" fullWidth onClick={handleCheckoutClick}>
          Proceed to Checkout
        </Button>
      </Box>
    </Box>
  )
}
