import React, { useState } from 'react';
import { Box, Grid, IconButton, Card, Snackbar, InputAdornment, CardContent, CardMedia, FormControl, Typography, CardActions, Button, TextField, InputLabel, Select, MenuItem, Pagination, List, ListItem, ListItemText } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import useProductList from '../../hooks/useProduct';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import useStore from '../../zustand/store';

export default function ProductList() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = React.useState(1);
  const [categoryPage, setCategoryPage] = React.useState(1);
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

  const handlePageChange = (event, value) => {
    if (selectedCategory) {
      setCategoryPage(value)
      setCategoryPageFromHook(value);
    } else {
      setPage(value);
    }
  }

  const handleCloseSnackbar = (event, reason) => {
    if(reason === 'clickaway'){
      return;
    }
    setOpenSnackbar(false);
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  }

  const handleSortChange = (e) => {
    setSort(e.target.value);
  }

  const handleViewProduct = (productId) => {
    // Placeholder function for viewing product details
    
    navigate(`/productView/${productId}`);
  };

  const handleCategoryChange = (categoryId) => {
  
    setSelectedCategory(categoryId === "All" ? "" : categoryId);
  }

  const handleAddToCart = (product) => {
    console.log(product);
    addToCart(product);
    setOpenSnackbar(true);
  }

  const categoriesData = [{ _id: "All", name: "All" }, ...categories]

  const productsToDisplay = selectedCategory ? categoryProductList : productList;
  const currentPageToDisplay = selectedCategory ? categoryPage : page; // NEW: to conditionally display the right current page
  const totalPagesToDisplay = selectedCategory ? categoryTotalPages : totalPages;

  
  const filteredProducts = productsToDisplay
  .filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "price_asc") {
        return a.price - b.price;
      } else if (sort === "price_desc") {
        return b.price - a.price;
      } else {
        return 0;
      }
    });
    
    return (
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ padding: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        
       <Box sx={{ display: 'flex', alignItems: 'center', gap: 2}}> 
       
       </Box>
        <TextField
          variant="outlined"
          label="Search Products"
          value={search}
          
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
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

      <Box sx={{ display: 'flex', flexDirection: 'row', marginTop: 2 }}>
        <Box sx={{ padding: 1, display: 'flex', flexDirection: 'column', width: '20%', marginRight: 2 }}>
        <Typography variant="h6">Sort by Categories</Typography>
        <List component="nav" aria-label="categories" sx={{ marginTop: 2 }}>
          {categoriesData.map((category, index) => (
            <ListItem button key={index} onClick={() => handleCategoryChange(category._id)}>
              <ListItemText primary={category.name} />
            </ListItem>
          ))}
        </List>
         </Box>

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', width: '80%' }}>

        <Grid container spacing={2}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
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
                  <Typography variant="body1" color="text.primary">
                    Price: ${product.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Category: {product.category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Stock: {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Box display="flex" justifyContent="space-between" width="100%">
                    <Button size="small"
                     color="primary" 
                     disabled={product.stock === 0} 
                     variant="contained" 
                     startIcon={<ShoppingCartIcon />}
                     onClick={() => handleAddToCart(product)}>
                      Add to Cart
                    </Button>
                    <Button size="small" color="secondary" onClick={() => handleViewProduct(product._id)} variant="outlined" startIcon={<VisibilityIcon />}>
                      View Product
                    </Button>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>


        <Box sx={{ display: 'flex', justifyContent: 'center', padding: 3 }}>
          <Pagination
            page={currentPageToDisplay} // UPDATED: to conditionally display the right current page
            count={totalPagesToDisplay}
            color="primary"
            onChange={handlePageChange}
            size="large"
            shape="rounded"
            showFirstButton
            showLastButton
            sx={{
              ...theme.components.MuiPagination,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        </Box>
      </Box>
    </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="Item added to cart"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
}
