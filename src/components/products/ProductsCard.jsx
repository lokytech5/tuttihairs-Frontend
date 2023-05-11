import React from 'react'
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
    Grid,
    Chip,
    Box,
    CardActions,
    Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import useStore from '../../zustand/store';

export default function ProductsCard({ product }) {
    const addToCart = useStore((state) => state.addToCart);
    const navigate = useNavigate();

    const handleViewProduct = (productId) => {
        navigate(`/product/${productId}`);
    };

    const handleAddToCart = (productId) => {
        // Add the product to the cart
        addToCart(product);
    };

    return (
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card>
                <CardActionArea onClick={() => handleViewProduct(product._id)}>
                    <CardMedia
                        component="img"
                        height="200"
                        image={product.image}
                        alt={product.name}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {product.description}
                        </Typography>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                            <Typography variant="h6">
                                Price: ${product.price}
                            </Typography>
                            <Chip
                                label={`Stock: ${product.stock}`}
                                color={product.stock > 0 ? 'success' : 'error'}
                            />
                        </Box>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewProduct(product._id)}
                    >
                        View Details
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<ShoppingCartIcon />}
                        onClick={() => handleAddToCart(product._id)}
                        disabled={product.stock <= 0}
                    >
                        Add to Cart
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    );
}
