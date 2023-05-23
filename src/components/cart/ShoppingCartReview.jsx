import React from 'react'
import useStore from '../../zustand/store'
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Grid, Card, CardMedia, CardContent, Chip } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
export default function ShoppingCartReview() {
    const navigate = useNavigate()
    const { cartItems, cartSummary } = useStore(state => ({
        cartItems: state.cartItems,
        cartSummary: state.cartSummary
    }))

    const handleProceedToShipping = () => {
        navigate('/shipping')
    }

    return (
        <Grid container spacing={2} sx={{ padding: '0 1em' }}>
            <Grid item xs={12} md={8}>
                <Typography variant="h6" component="div" sx={{ textAlign: 'center', mt: 2, mb: 2 }}>
                    Your Cart Review
                </Typography>
                {cartItems.map(item => (
                    <Card sx={{ marginTop: 2 }} key={item.product._id}>
                        <Grid container>
                            <Grid item xs={4} md={2}>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={item.image}
                                    alt={item.title}
                                />
                            </Grid>
                            <Grid item xs={8} md={10}>
                                <CardContent>
                                    <Typography variant="h5" component="div">{item.title}</Typography>
                                    <Chip label={`Color: ${item.color}`} variant="outlined" />
                                    <Chip label={`Inches: ${item.inches}`} variant="outlined" />
                                    <Chip label={`Length: ${item.length}`} variant="outlined" />
                                    <Chip label={`Grams: ${item.grams}`} variant="outlined" />
                                    <Chip label={`Quantity: ${item.quantity}`} variant="outlined" />
                                    <Typography variant="h6">Price: ${item.price}</Typography>
                                </CardContent>
                            </Grid>
                        </Grid>
                    </Card>
                ))}
            </Grid>
            <Grid item xs={12} md={4}>
                <Box sx={{ marginTop: 2, padding: 2, border: '1px solid grey', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', }}>
                        <ShoppingCartIcon />
                        <Typography variant="h6" component="div">
                            Total Items: {cartSummary.totalItems}
                        </Typography>
                    </Box>
                    <Typography variant="h6" component="div">
                        Total Price: ${cartSummary.totalPrice}
                    </Typography>
                    <Button sx={{ mt: 2 }} variant="contained" color="primary" onClick={handleProceedToShipping}>
                        Proceed to Shipping
                    </Button>
                </Box>
            </Grid>
        </Grid>
    )
}
