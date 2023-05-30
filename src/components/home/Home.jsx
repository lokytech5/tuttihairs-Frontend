import React from 'react'
import {
    Box,
    Container,
    Grid,
    Typography,
    Paper,
    Button,
    CircularProgress,
    TextField,
} from '@mui/material';
import { styled } from '@mui/system';
import Pagination from '@mui/material/Pagination';
import useCategories from '../../hooks/useCategories';
import useCuratedCollection from '../../hooks/useCuratedCollection';
import Categories from './Categories'
import PromoSection from './PromoSection'
import FeaturedSwiper from './FeaturedSwiper';
import CuratedCollection from './CuratedCollection';
import backgroundImage from '../../assets/tuti-2.png'
import { alpha } from '@mui/system';

const BackgroundImageBox = styled(Paper)(({ theme }) => ({
    py: 2,
    height: '500px',
    width: '100%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
        height: '750px',
    },
}));

const TextSection = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
}));

const ImageSection = styled(Box)(({ theme }) => ({
    backgroundImage: `url(${backgroundImage})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    height: '100%',
}));

export default function Home() {
    const [page, setPage] = React.useState(1);
    // eslint-disable-next-line
    const { categories, loading: categoriesLoading, error: categoriesError, totalPages } = useCategories(page);
    const { curatedCollection, loading: collectionsLoading, error: collectionsError } = useCuratedCollection();

    const currentHour = new Date().getHours();
    let greeting;
    if (currentHour < 12) {
        greeting = 'Good Morning';
    } else if (currentHour < 18) {
        greeting = 'Good Afternoon';
    } else {
        greeting = 'Good Evening'
    }

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    return (
        <>
            <Box>
                <BackgroundImageBox>
                    <Box
                        sx={{
                            position: 'relative',
                            height: '100%',
                            backgroundImage: `url(${backgroundImage})`,
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                            overflow: 'hidden',
                            '::after': {
                                content: '""',
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                width: '100%',
                                height: '100%',
                                background: 'rgba(0, 0, 0, .5)',
                                transform: 'translate(-50%, -50%) rotate(-45deg)',
                                zIndex: 1,
                            },
                        }}
                    >
                        <Box
                            sx={{
                                position: 'relative',
                                zIndex: 2,
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                            }}
                        >
                            <Typography
                                variant="h2"
                                align="center"
                                sx={{
                                    fontFamily: 'Roboto, Arial, sans-serif',
                                    fontWeight: 'bold',
                                    letterSpacing: '2px',
                                    marginBottom: '2rem',
                                    textTransform: 'uppercase',
                                    fontSize: '3rem', // Increase text size
                                    background: 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Global ecommerce shop
                            </Typography>
                            <Typography
                                variant="h5"
                                align="center"
                                sx={{
                                    fontFamily: 'Roboto, Arial, sans-serif',
                                    fontWeight: 300,
                                    color: '#fff',
                                    letterSpacing: '1px',
                                    marginBottom: '2rem',
                                }}
                            >
                                {greeting}, Welcome to Tuti Hairs
                            </Typography>
                            <Typography
                                variant="body1"
                                align="center"
                                sx={{
                                    fontFamily: 'Roboto, Arial, sans-serif',
                                    fontWeight: 300,
                                    color: '#fff',
                                    letterSpacing: '1px',
                                    marginBottom: '2rem',
                                }}
                            >
                                Discover the Best Products at Unbeatable Prices
                            </Typography>
                            <Button
                                variant="outlined"
                                size="large"
                                sx={{
                                    borderRadius: '50px',
                                    borderColor: '#fff',
                                    color: '#fff',
                                    textTransform: 'uppercase',
                                    ':hover': {
                                        backgroundColor: alpha('#ff5252', 0.1),
                                    },
                                }}
                            >
                                Start Shopping
                            </Button>
                        </Box>
                    </Box>
                </BackgroundImageBox>


                <Container maxWidth="lg">
                    <Box my={4}>
                        <Typography
                            variant="h4"
                            align="center"
                            sx={{
                                fontFamily: 'Roboto',
                                fontWeight: 500,
                                marginBottom: 2,
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

                    <Box my={2}>
                        <PromoSection />
                    </Box>

                    <Box>
                        <FeaturedSwiper />
                    </Box>
                </Container>


            </Box>
            <Box>


                <Container maxWidth="lg">


                    <Box my={4}>
                        <Typography
                            variant="h4"
                            align="center"
                            sx={{
                                fontFamily: 'Roboto',
                                fontWeight: 500,
                                marginBottom: 2,
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
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            />
                        </Box>
                    </Box>
                </Container>

                <Box sx={{ bgcolor: 'background.paper', p: 3, mt: 3 }}>
                    <Container maxWidth="sm">
                        <Typography variant="h5" gutterBottom>
                            Subscribe to Our Newsletter
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Get updates about new products and special deals.
                        </Typography>
                        <Box component="form" sx={{ mt: 2 }}>
                            <TextField
                                fullWidth
                                label="Email"
                                variant="outlined"
                                sx={{ mb: 2 }}
                            />
                            <Button variant="contained" color="primary">
                                Subscribe
                            </Button>
                        </Box>
                    </Container>
                </Box>

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
