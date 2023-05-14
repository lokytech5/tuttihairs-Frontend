import React from 'react'
import { Box, Grid, Card, CircularProgress, CardContent, CardMedia, Typography, Button, TextField, Rating } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useProductView from '../../hooks/useProductView';
import { useParams } from 'react-router-dom';
export default function ProductView() {
  const { productId } = useParams();
  const theme = useTheme();
  const { productViewDetails, loading, error } = useProductView(productId);

  if (loading || !productViewDetails) {
    return <CircularProgress />
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleRatingSubmit = (e) => {
    e.preventDefault();
    // Implement your logic to submit the rating
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    // Implement your logic to submit the review
  };

  const handleAddToCart = () => {
    // Implement your logic to add the product to the user's cart
  };



  return (
   <>
      <Box sx={{ flexGrow: 1, padding: theme.spacing(2) }}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography variant="body1">Error: {error}</Typography>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="div"
                  image={productViewDetails.image}
                  alt={productViewDetails.name}
                  sx={{ height: 0, paddingTop: '56.25%' }} // 16:9 aspect ratio
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="div">{productViewDetails.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{productViewDetails.description}</Typography>
                  <Typography variant="body1" color="text.primary">Price: ${productViewDetails.price}</Typography>
                  <Typography variant="body2" color="text.secondary">
                        Stock: {productViewDetails.stock > 0 ? `${productViewDetails.stock} items in stock` : "Out of Stock"}
                  </Typography>
                      <Box mt={2}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleAddToCart}
                          disabled={productViewDetails.stock <= 0}
                        >
                          Add to Cart
                        </Button>
                      </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Typography variant="h6">Product Details:</Typography>
              <Typography variant="body2">Category: {productViewDetails.category.name}</Typography>
              <Typography variant="body2">Colors: {productViewDetails.category.colors.join(", ")}</Typography>
              <Typography variant="body2">Inches: {productViewDetails.category.inches}</Typography>
              {/* Add other category details as needed */}
              <Box mt={3}>
                <Typography variant="h6">Ratings and Reviews:</Typography>
                {productViewDetails.ratings.map((rating, index) => (
                  <Box key={index}>
                    <Typography variant="body2">Rating: {rating}</Typography>
                  </Box>
                ))}
                {productViewDetails.reviews.map((review, index) => (
                  <Box key={index}>
                    <Typography variant="body2">Review: {review}</Typography>
                  </Box>
                ))}
                <form onSubmit={handleRatingSubmit}>
                  <Box display="flex" alignItems="center" mt={2}>
                    <Rating name="simple-controlled" />
                    <Button type="submit" variant="contained" color="primary" size="small" 
                    style={{ marginLeft: theme.spacing(2) }}>Submit Rating</Button>
                  </Box>
                </form>
                <form onSubmit={handleReviewSubmit}>
                  <TextField
                    variant="outlined"
                    label="Write a review"
                    multiline
                    rows={4}
                    fullWidth
                    margin="normal"
                  />
                  <Button type="submit" variant="contained" color="primary">Submit Review</Button>
                </form>
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>
   </>
  )
}
