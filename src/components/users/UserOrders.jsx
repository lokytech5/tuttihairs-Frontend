import React, { useEffect } from 'react'
import useOrder from '../../hooks/useOrder';
import useUserStore from '../../zustand/userStore';
import { Box, CircularProgress, Container, Grid, Card, CardContent, Typography, Collapse, Badge, Avatar, Tooltip, Divider } from '@mui/material';
import { styled } from '@mui/system';


const StyledCard = styled(Card)(({ theme }) => ({
   
    color: theme.palette.text.secondary,
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
}));

export default function UserOrders() {
    const { fetchOrdersByUserId, order, loading, error } = useOrder(); // use fetchOrdersByUserId instead
    const userData = useUserStore((state) => state.userData);
    console.log(order)

    useEffect(() => {
        if (userData) {
            fetchOrdersByUserId(userData._id); // use fetchOrdersByUserId to get the user's orders
        }
    }, [fetchOrdersByUserId, userData]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container>
                <Typography variant="h6" color="error" align="center" mt={4}>
                    {error}
                </Typography>
            </Container>
        );
    }

    if (!order || order.length === 0) {
        return (
            <Container>
                <Typography variant="h6" align="center" mt={4}>
                    You haven't placed any orders yet.
                </Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Typography variant="h4" align="center" mt={4} mb={3}>
                Your Orders
            </Typography>
            <Grid container spacing={4}>
                {order.map((orderItem, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <StyledCard raised={true}>
                            <CardContent>
                                <Badge badgeContent={orderItem.status} color="secondary" sx={{margin: '20px'}}>
                                    <Typography variant="h5" gutterBottom>
                                        Order ID: {orderItem.id}
                                    </Typography>
                                </Badge>
                                <Typography color="textSecondary" gutterBottom>
                                    Order Date: {new Date(orderItem.orderDate).toLocaleDateString()}
                                </Typography>
                                <Typography variant="h6" gutterBottom>
                                    Total Price: ${orderItem.totalPrice}
                                </Typography>
                                <Divider />
                                <Typography variant="subtitle1" gutterBottom>
                                    Shipping Details:
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Name: {orderItem.shipping.name}<br />
                                    Address: {orderItem.shipping.address}<br />
                                    City: {orderItem.shipping.city}<br />
                                    Postal Code: {orderItem.shipping.postalCode}
                                </Typography>
                                <Divider />
                                <Typography variant="subtitle1" gutterBottom>
                                    Items:
                                </Typography>
                                <Collapse in={true}>
                                    {orderItem.items.map((item, itemIndex) => (
                                        
                                        <Typography variant="body2" color="textSecondary" key={itemIndex}>
                                        name: {item.product.name}<br/>
                                        Price: ${item.product.price}<br/>
                                        Quantity: {item.quantity}<br/>
                                        Subtotal: ${item.subtotal}
                                    </Typography>
                                       
                                    ))}
                                </Collapse>
                            </CardContent>
                        </StyledCard>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );

}
