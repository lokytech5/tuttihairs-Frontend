import React, { useState } from 'react'
import useCategoryDetails from '../../hooks/useCategoryDetails'
import { useParams } from 'react-router-dom'
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    CircularProgress,
    Box,
    Button,
    MenuItem,
    FormControl,
    InputLabel,
    Select
} from '@mui/material'
import Rating from '@mui/material/Rating';
import useStore from '../../zustand/store';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import useCategoryProducts from '../../hooks/useCategoryProducts';

export default function ProductDetails({ product }) {
    const { productId } = useParams()
    const { categoryDetails, loading, error } = useCategoryDetails(productId)
    const { products,updateProductStock } = useCategoryProducts()
    const [selectedColor, setSelectedColor] = useState('')
    const [selectedInches, setSelectedInches] = useState('')
    const addToCart = useStore((state) => state.addToCart);
    const userId = useStore((state) => state.userId);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleAddToCart = () => {
        // Implement your add to cart logic here
        addToCart(categoryDetails, userId, categoryDetails._id)
        setSnackbarOpen(true);
        const newStock = categoryDetails.stock - 1;
        updateProductStock(productId, newStock)
    }

    if (loading) {
        return <CircularProgress />
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!categoryDetails) {
        return null;
    }

    return (
        <Box display="flex" justifyContent="center" my={4}>
            <Card sx={{ maxWidth: 500 }}>
                <CardMedia
                    component="img"
                    height="300"
                    image={categoryDetails.image}
                    alt={categoryDetails.name}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {categoryDetails.name}
                    </Typography>
                    <Rating value={categoryDetails.ratings.average} precision={0.1} readOnly />
                    <Typography variant="body2" color="text.secondary">
                        {categoryDetails.description}
                    </Typography>
                    <Typography variant="h6">
                        Price: ${categoryDetails.price}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Category: {categoryDetails.category.name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Stock: {categoryDetails.stock}
                    </Typography>
                    <Box my={2}>
                        <FormControl fullWidth variant="outlined" size="small">
                            <InputLabel>Color</InputLabel>
                            <Select
                                value={selectedColor}
                                onChange={(e) => setSelectedColor(e.target.value)}
                                label="Color"
                            >
                                {categoryDetails.category.colors.map((color, index) => (
                                    <MenuItem key={index} value={color}>{color}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box my={2}>
                        <FormControl fullWidth variant="outlined" size="small">
                            <InputLabel>Inches</InputLabel>
                            <Select
                                value={selectedInches}
                                onChange={(e) => setSelectedInches(e.target.value)}
                                label="Inches"
                            >
                                <MenuItem value={categoryDetails.category.inches}>{categoryDetails.category.inches}</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box mt={2}>
                        {categoryDetails.stock > 0 ? (

                        <Button variant="contained" 
                        color="primary" 
                        onClick={handleAddToCart}
                                disabled={categoryDetails.stock <= 0}>
                            Add to Cart
                        </Button>
                    ): (
                                <Button variant="outlined" color="error" disabled>
                                    Out of Stock
                                </Button>
                    )}
                    </Box>
                </CardContent>
            </Card>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <MuiAlert onClose={handleCloseSnackbar} severity="success" elevation={6} variant="filled">
                    added to cart!
                </MuiAlert>
            </Snackbar>
        </Box>
    )
}
