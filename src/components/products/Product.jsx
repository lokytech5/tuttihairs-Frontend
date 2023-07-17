import React, { useState } from 'react';
import { Box, Grid, Rating, Card, Snackbar, InputAdornment, CardContent, CardMedia, FormControl, Typography, CardActions, Button, TextField, InputLabel, Select, MenuItem, Pagination } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import useProductList from '../../hooks/useProduct';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import useStore from '../../zustand/store';

export default function ProductList() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = React.useState(1);
  const [sortedProductList, setSortedProductList] = useState([])
  const [sortedCategoryProductList, setSortedCategoryProductList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const addToCart = useStore((state) => state.addToCart);
  const theme = useTheme();
  const navigate = useNavigate();

  const { productList,
    categoryProductList,
    // eslint-disable-next-line
    loading,
    // eslint-disable-next-line
    error,
    totalPages,
    categories,
    categoryTotalPages,
    setCategoryPage: setCategoryPageFromHook } = useProductList(page, selectedCategory, search);

  // Use a useEffect hook to sort the product lists whenever productList, categoryProductList or sort changes.
  React.useEffect(() => {
    let sortedProducts = [...productList];
    let sortedCategoryProducts = [...categoryProductList];

    if (sort === "price_asc") {
      sortedProducts.sort((a, b) => a.price - b.price);
      sortedCategoryProducts.sort((a, b) => a.price - b.price);
    } else if (sort === "price_desc") {
      sortedProducts.sort((a, b) => b.price - a.price);
      sortedCategoryProducts.sort((a, b) => b.price - a.price);
    }

    setSortedProductList(sortedProducts);
    setSortedCategoryProductList(sortedCategoryProducts);
  }, [productList, categoryProductList, sort]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  }

  const handleCategoryChange = (categoryId) => {

    setSelectedCategory(categoryId === "All" ? "" : categoryId);
  }

  const handleAddToCart = (product) => {
    addToCart(product);
    setOpenSnackbar(true);
  }

  const handleSortChange = (e) => {
    setSort(e.target.value);
  }

  const categoriesData = [{ _id: "All", name: "All" }, ...categories]


  const handleViewDetails = (productId) => {
    navigate(`/productView/${productId}`);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>

          <Box my={2}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search products"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box my={2}>
            <InputLabel>Sort by Category</InputLabel>
            <Select
              variant="outlined"
              placeholder="Sort by category"
              value={selectedCategory}
              onChange={(event) => handleCategoryChange(event.target.value)}
              fullWidth
            >
              {categoriesData.map((category) => (
                <MenuItem key={category._id} value={category._id}>{category.name}</MenuItem>
              ))}
            </Select>
          </Box>

          <Box my={2}>
            <FormControl variant="outlined" sx={{ minWidth: 200, marginTop: 1 }}>
              <InputLabel> Sort by</InputLabel>
              <Select
                value={sort}
                onChange={handleSortChange}
                label="Sort by">

                <MenuItem value="">None </MenuItem>
                <MenuItem value="price_asc">Price (low to high) </MenuItem>
                <MenuItem value="price_desc">Price (high to low) </MenuItem>
              </Select>
            </FormControl>
          </Box>

        </Grid>
        <Grid item xs={12} md={9}>
          <Grid container spacing={3}>
            {(selectedCategory ? sortedCategoryProductList : sortedProductList).map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <Box my={2}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image={product.image}
                      alt={product.name}
                    />
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {product.name}
                      </Typography>
                      <Rating value={product.averageRating} readOnly />
                      <Typography variant="body2" color="text.secondary">
                        {product.description}
                      </Typography>
                      <Typography variant="body1" component="p">
                        Price: ${product.price / 100}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Stock: {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                      </Typography>
                    </CardContent>
                    <CardActions>

                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewDetails(product._id)}>
                        View Details
                      </Button>

                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<ShoppingCartIcon />}
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                      >
                        Add to Cart
                      </Button>
                    </CardActions>
                  </Card>

                </Box>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Pagination
                count={selectedCategory ? categoryTotalPages : totalPages}
                page={page}
                onChange={(event, value) => {
                  setPage(value);
                  if (selectedCategory) setCategoryPageFromHook(value);
                }}
                size="large"
                shape="rounded"
                showFirstButton
                showLastButton
                color="primary"
                sx={{
                  ...theme.components.MuiPagination,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
