import React from 'react'
import useCuratedCollectionDetails from '../../hooks/useCuratedCollectionDetails'
import { useParams, Link } from 'react-router-dom'
import { Alert, CircularProgress, Grid, Rating, Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material'
import { styled } from '@mui/system';
import useStore from '../../zustand/store'


const StyledCard = styled(Card)(({ theme }) => ({
    margin: theme.spacing(2),
}));

export default function CuratedCollectionDetails() {
    const { collectionId } = useParams()
    const { curatedCollectionDetails, loading, error } = useCuratedCollectionDetails(collectionId)
    const addToCart = useStore((state) => state.addToCart);

    if (loading) {
        return <CircularProgress />
    }

    if (error) {
       return <Alert severity="error">{error}</Alert>;  
    }

    // Return early if the data is not yet available.
    if (!curatedCollectionDetails) {
        return null;
    }

    const handleAddToCart = (productId) => {
        // Add the product to the shopping cart.
        // This is a placeholder function, you should replace this with your actual implementation.
        // Find the product that matches the productId
        const productToAdd = curatedCollectionDetails.product.find(product => product._id === productId);

        // Check if we found a matching product
        if (productToAdd) {
            // If we found a product, add it to the cart
            addToCart(productToAdd);
            console.log(`Product ${productId} added to cart.`);
        } else {
            // If we didn't find a product, log an error
            console.log(`Product with id ${productId} not found.`);
        }
    }

    return (
        <div>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <img src={curatedCollectionDetails.bannerImage} alt={curatedCollectionDetails.name} style={{ width: '100%', height: '400px', objectFit: 'cover', marginBottom: '1rem', }} />
                <Typography variant="h3" component="h1" gutterBottom align="center">
                    {curatedCollectionDetails.name}
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom align="center">
                    {curatedCollectionDetails.description}
                </Typography>
                <Grid container spacing={3}>
                    {curatedCollectionDetails.product.map((product) => (
                        <Grid item xs={12} sm={6} md={4} key={product._id}>
                            <StyledCard>
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
                                    <Rating value={product.averageRating} readOnly />
                                    <Typography variant="body2" color="text.secondary">
                                        {product.description}
                                    </Typography>
                                    <Typography variant="h6" color="text.primary">
                                        Price: ${product.price}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Stock: {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                                    </Typography>
                                    <Box mt={2}>
                                        <Button variant="contained" color="secondary" disabled={product.stock === 0} onClick={() => handleAddToCart(product._id)}>
                                            Add to Cart
                                        </Button>
                                        <Button component={Link} to={`/productView/${product._id}`} variant="outlined" color="secondary" style={{ marginLeft: '10px' }}>
                                            View Product
                                        </Button>
                                    </Box>
                                </CardContent>
                            </StyledCard>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </div>
    )
}
