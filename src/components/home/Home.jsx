import React from 'react'
import {
    Box,
    Container,
    Grid,
    Typography,
    Paper,
    Button,
    CircularProgress,
} from '@mui/material';

import Pagination from '@mui/material/Pagination';
import { useTheme } from '@mui/material/styles';
import useCategories from '../../hooks/useCategories';
import useCuratedCollection from '../../hooks/useCuratedCollection';
import Categories from './Categories'
import PromoSection from './PromoSection'
import FeaturedSwiper from './FeaturedSwiper';
import CuratedCollection from './CuratedCollection';

export default function Home() {
    const theme = useTheme();
    const [page, setPage] = React.useState(1);
    const { categories, loading: categoriesLoading, error: categoriesError, totalPages } = useCategories(page);
    const { curatedCollection, loading: collectionsLoading, error: collectionsError } = useCuratedCollection();

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    return (
        <>
            <Box>
                <Container maxWidth="lg">
                    <Box my={4}>
                        <Paper sx={{
                            py: 2,
                            backgroundImage: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)', // Apply a gradient background
                        }}>
                            <Box p={2}>
                                <Typography
                                    variant="h2"
                                    align="center"
                                    style={{
                                        fontFamily: 'Roboto', // Set the custom font
                                        fontWeight: 500,
                                        fontSize: 'bold',
                                        color: '#fff', // Change text color to white
                                    }}
                                >
                                    Welcome to Tuti Hairs
                                </Typography>
                                <Typography
                                    variant="h5"
                                    align="center"
                                    style={{
                                        fontFamily: 'Roboto',
                                        fontWeight: 300,
                                        color: '#fff',
                                        marginTop: '1rem',
                                    }}
                                >
                                    Discover the Best Products at Unbeatable Prices
                                </Typography>
                                <Box display="flex" justifyContent="center" mt={2}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="large"
                                        onClick={() => {
                                            // Handle the call-to-action button click here
                                        }}
                                    >
                                        Start Shopping
                                    </Button>
                                </Box>
                            </Box>
                            <Box my={4}>
                                <FeaturedSwiper />
                            </Box>
                        </Paper>

                        <Box my={4}>
                            <PromoSection />
                        </Box>
                    </Box>

                    {/* Add curated collections here */}
                    <Box my={4}>
                        <Typography
                            variant="h4"
                            align="center"
                            style={{
                                fontFamily: 'Roboto',
                                fontWeight: 500,
                                marginBottom: theme.spacing(2),
                            }}
                        >
                            Curated Collections
                        </Typography>

                        {collectionsLoading ? (
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <CircularProgress />
                            </Box>
                        ) : collectionsError ? (
                            <Typography variant="body2" align="center" color="text.secondary">
                                {collectionsError}
                            </Typography>
                            ) : curatedCollection ? (
                            <Grid container spacing={2}>
                                {curatedCollection.map((collection) => (
                                    <CuratedCollection key={collection._id} collection={collection} />
                                ))}
                            </Grid>
                        ) : null}


                    </Box>

                    <Box my={4}>
                        <Typography
                            variant="h4"
                            align="center"
                            style={{
                                fontFamily: 'Roboto',
                                fontWeight: 500,
                                marginBottom: theme.spacing(2),
                            }}
                        >
                            Browse Our Categories
                        </Typography>

                        <Grid container spacing={2}>

                            <Categories categories={categories} page={page} />

                        </Grid>
                        <Box my={4}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
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
                </Container>

                <Box mt={8} py={4} bgcolor="primary.main">
                    <Container maxWidth="lg">
                        <Typography variant="body2" align="center" color="text.secondary">
                            &copy; {new Date().getFullYear()} Your Ecommerce Store. All rights
                            reserved.
                        </Typography>
                    </Container>
                </Box>
            </Box>

        </>
    )
}
