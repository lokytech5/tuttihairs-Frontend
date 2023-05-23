import React, { useState } from 'react'
import { Alert, Box, Grid, Card, FormControl, Select, Divider, CircularProgress, Modal, CardContent, CardMedia, Typography, Button, TextField, Rating, InputLabel, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useProductView from '../../hooks/useProductView';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate } from 'react-router-dom';
import useStore from '../../zustand/store';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


const formValidationSchema = z.object({
  reviewText: z.string().nonempty('Text is required'),
  rating: z.number().min(1, 'Rating is required and should be at least 1').max(5, 'Rating should not be more than 5'),
});


export default function ProductView() {
 
  const { productId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [loginPromptOpen, setLoginPromptOpen] = React.useState(false);
  // eslint-disable-next-line
  const { productViewDetails, setProductViewDetails, loading, reviewLoading, setError, error, addProductReview, deleteProductReview } = useProductView(productId);
  const isAuthenticated = useStore((state) => state.isAuthenticated)
  const addToCart = useStore((state) => state.addToCart);
  const userId = useStore((state) => state.userId);
  const username = useStore((state) => state.username);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedInches, setSelectedInches] = useState('')
  const [selectedLength, setSelectedLength] = useState('')
  const [selectedGrams, setSelectedGrams] = useState('')
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  let averageRating = 0;
  let ratingCount = Array(5).fill(0);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({ resolver: zodResolver(formValidationSchema) })

  if (loading || !productViewDetails) {
    return <CircularProgress />
  }

  // Now that we've checked that productViewDetails is not null, calculate averageRating and ratingCount
  averageRating = productViewDetails.reviews.reduce((acc, review) => acc + review.rating, 0) / productViewDetails.reviews.length || 0;
  productViewDetails.reviews.forEach((review) => {
    ratingCount[review.rating - 1]++;
  });

  if (error) {
    return <Alert severity="error">{error}</Alert>;  
  }

  // eslint-disable-next-line
  const handleRatingSubmit = (e) => {
    // eslint-disable-next-line
    e.preventDefault();
    // Implement your logic to submit the rating
    if (!isAuthenticated) {
      // If the user is not authenticated, redirect them to the login page
      setLoginPromptOpen(true);
      return;
    }
  };

  const handleReviewSubmit = async (data) => {
   
    if (!isAuthenticated) {
      // If the user is not authenticated, redirect them to the login page
      setLoginPromptOpen(true);
      return;
    }
    // If the user is authenticated, continue with submitting the review
    const reviewTextData = {
      reviewText: data.reviewText,
      rating: data.rating,
      userId: userId,
      username: username,

    }
    // Then try to add the review on the server
    addProductReview(reviewTextData).then(() => {
      reset({ reviewText: "", rating: 0 });
    }).catch((error) => {
      setError("Failed to submit review. Please try again.");
    });
    
  };

  const handleReviewDelete = async (reviewId) => {
    if (!isAuthenticated) {
      setLoginPromptOpen(true);
      return;
    }
    // If the user is authenticated, continue with deleting the review
    // Then try to delete the review on the server
    try {
      await deleteProductReview(reviewId)
    } catch (error) {
      setError("Failed to delete review. Please try again.");
    }

  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };


  const handleAddToCart = () => {
    // Implement your logic to add the product to the user's cart

    const productDetails = {
      product: productViewDetails,
      color: selectedColor,
      inches: selectedInches,
      length: selectedLength,
      grams: selectedGrams,
      quantity: selectedQuantity,
    };

    console.log("Product details to be added to the cart: ", productDetails);

    console.log("Color:", selectedColor);
    console.log("Inches:", selectedInches);
    console.log("Length:", selectedLength);
    console.log("Grams:", selectedGrams);
    console.log("Quantity:", selectedQuantity);
    addToCart(productViewDetails, selectedQuantity, selectedColor, selectedInches, selectedLength, selectedGrams)
    console.log("Cart updated");
    setSnackbarOpen(true);
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
                  <Rating name="read-only" value={averageRating} readOnly precision={0.1} />
                  <Typography variant="body2" color="text.secondary">{productViewDetails.description}</Typography>
                  <Typography variant="body1" color="text.primary">Price: ${productViewDetails.price}</Typography>
                  <Typography variant="body2">Category: {productViewDetails.category.name}</Typography>

                  <Typography variant="body2" color="text.secondary">
                    Stock: {productViewDetails.stock > 0 ? `${productViewDetails.stock} items in stock` : "Out of Stock"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#123abc' }} color="text.secondary">
                    Views: {productViewDetails.viewCount}
                  </Typography>

                  <Box my={2}>
                    <FormControl fullWidth variant="outlined" size="small">
                      <InputLabel>Color</InputLabel>
                      <Select
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        label="Color"
                      >
                        {productViewDetails.category.colors.map((color, index) => (
                          <MenuItem key={index} value={color}>{color}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Box my={2}>
                    <FormControl fullWidth variant="outlined" size="small">
                      <InputLabel>inches</InputLabel>
                      <Select
                        value={selectedInches}
                        onChange={(e) => setSelectedInches(e.target.value)}
                        label="Inches"
                      >
                        <MenuItem value={productViewDetails.category.inches}>{productViewDetails.category.inches}</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  {/* New code for length and grams */}
                  {productViewDetails.category.name === 'Closure' || productViewDetails.category.name === 'Frontal' ? (
                    <Box my={2}>
                      <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel>Length</InputLabel>
                        <Select
                          value={selectedLength}
                          onChange={(e) => setSelectedLength(e.target.value)}
                          label="Length"
                        >
                          {productViewDetails.category.length.map((length, index) => (
                            <MenuItem key={index} value={length}>{length}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  ) : null}


                  {productViewDetails.category.name === 'Bundles' ? (
                    <Box my={2}>
                      <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel>Grams</InputLabel>
                        <Select
                          value={selectedGrams}
                          onChange={(e) => setSelectedGrams(e.target.value)}
                          label="Grams"
                        >
                          <MenuItem value={productViewDetails.category.grams}>{productViewDetails.category.grams}</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  ) : null}

                  <Box my={2}>
                        <FormControl fullWidth variant="outlined" size="small">
                          <InputLabel>Quantity</InputLabel>
                          <Select
                            value={selectedQuantity}
                            onChange={(e) => setSelectedQuantity(e.target.value)}
                            label="Quantity"
                          >
                            {Array.from({ length: productViewDetails.stock }, (_, i) => i + 1).map((quantity, index) => (
                              <MenuItem key={index} value={quantity}>{quantity}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                  </Box>

                  <Box mt={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAddToCart()}
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

              <Typography variant="body2">Colors: {productViewDetails.category.colors.join(", ")}</Typography>
              <Typography variant="body2">Inches: {productViewDetails.category.inches}</Typography>
              {/* Add other category details as needed */}
              {/* New Divider */}
              <Divider variant="middle" style={{ margin: "2em 0" }} />
              <Box mt={3}>
                <Typography variant="h6">Users Ratings and Reviews ({productViewDetails.reviews.length})</Typography>

                {productViewDetails.reviews.forEach((review) => {
                  ratingCount[review.rating - 1]++;
                })}
                {ratingCount.map((count, index) => (
                  <Typography key={index} variant="body2">{index + 1} star: {count}</Typography>
                ))}

                {/* New Divider */}
                <Divider variant="middle" style={{ margin: "2em 0" }} />

                {productViewDetails.reviews.map((review, index) => {
                  return (
                    <Box key={index}>
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2">Rating: </Typography>
                        <Rating name="read-only" value={review.rating} readOnly size='small' />
                        {/*Add a delete button to each review */}
                      </Box>
                      <Typography variant="body2">Review: {review.review}</Typography>
                      {/* Display the user ID or username if available */}
                      <Typography variant="body2">User: {review.username}</Typography>
                      {review.userId === userId && (
                        <Box mt={1}>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleReviewDelete(review._id)}
                            disabled={loading}>
                            {loading ? "Deleting ..." : "Delete Review"}
                          </Button>
                        </Box>
                      )}
                      {error && <Typography color="error">{error}</Typography>}
                    </Box>
                  );
                })}

                {/* New Divider */}
                <Divider variant="middle" style={{ margin: "2em 0" }} />

                <Typography variant="h6">Add Your Ratings and Reviews:</Typography>
                <form onSubmit={handleSubmit(handleReviewSubmit)}>
                  <Controller
                    name="rating"
                    control={control}
                    defaultValue={0}
                    render={({ field }) => (
                      <Rating
                        name="rating"
                        value={field.value}
                        onChange={(event, newValue) => {
                          field.onChange(newValue);
                        }}
                      />
                    )}
                  />

                  <TextField
                    variant="outlined"
                    label="Write a review"
                    name="reviewText"
                    multiline
                    rows={4}
                    fullWidth
                    margin="normal"
                    {...register('reviewText')}
                    error={errors.reviewText ? true : false}
                    helperText={errors.reviewText ? errors.reviewText.message : ''}
                  />
                  <Button type="submit"
                    variant="contained"
                    color="primary"
                    disabled={reviewLoading}>
                    {reviewLoading ? <CircularProgress size={24} /> : 'Submit Review'}
                  </Button>
                </form>
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>

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

      <Modal
        open={loginPromptOpen}
        onClose={() => setLoginPromptOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Please log in to submit a review
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setLoginPromptOpen(false);
              navigate("/login");
            }}
          >
            Go to Login
          </Button>
        </Box>
      </Modal>
    </>
  )
}
