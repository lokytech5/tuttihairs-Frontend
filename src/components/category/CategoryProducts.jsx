import React from 'react'
import useCategoryProducts from '../../hooks/useCategoryProducts'
import ProductsCard from '../products/ProductsCard'
import { Alert, Grid, Box, CircularProgress, Pagination } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

export default function CategoryProducts() {
    const { categoryId } = useParams();
    const theme = useTheme();
    // console.log("CategoryProducts categoryId:", categoryId);
    const { products, loading, error, updateProductStock, categoryTotalPages, setCategoryPage, categoryPage } = useCategoryProducts(categoryId);
    // console.log("CategoryProducts products:", products);
    if (loading) {
        return <CircularProgress />
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;  
    }

    const handlePageChange = (event, value) => {
        setCategoryPage(value)
    }

    return (

        <Box justifyContent="center" marginTop={6} paddingX={4}>
            <Grid item xs={12} sm={12} md={10} lg={8}>
                <Grid container spacing={3}>
                    {products.map((product) => (
                        <ProductsCard key={product._id}
                            product={product}
                            updateProductStock={updateProductStock} />
                    ))}
                </Grid>
            </Grid>


            <Box sx={{ display: 'flex', justifyContent: 'center', padding: 3 }}>
                <Pagination
                    page={categoryPage}// UPDATED: to conditionally display the right current page
                    count={categoryTotalPages}
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

    )
}
