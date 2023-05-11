import React from 'react'
import useCategoryProducts from '../../hooks/useCategoryProducts'
import ProductsCard from './ProductsCard'
import { Grid, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function CategoryProducts() {
    const { categoryId } = useParams();
    console.log("CategoryProducts categoryId:", categoryId);
    const { products, loading, error } = useCategoryProducts(categoryId);
    console.log("CategoryProducts products:", products);
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (

        <Box justifyContent="center" marginTop={6} paddingX={4}>
            <Grid item xs={12} sm={12} md={10} lg={8}>
                <Grid container spacing={3}>
                    {products.map((product) => (
                        <ProductsCard key={product._id} product={product} />
                    ))}
                </Grid>
            </Grid>
        </Box>

    )
}
