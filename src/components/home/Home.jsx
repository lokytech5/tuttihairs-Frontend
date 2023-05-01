import React from 'react'
import {
    Box,
    Container,
    Grid,
    Typography,
    IconButton,
    Paper,
    Card,
    CardActionArea,
    CardContent,
    CardActions,
    CardMedia,
    Button,
} from '@mui/material';
import { styled } from '@mui/system';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Pagination from '@mui/material/Pagination';
import { useTheme } from '@mui/material/styles';


import { categories } from './Categories'
import PromoSection from './PromoSection'
import FeaturedSwiper from './FeaturedSwiper';

const CustomGrid = styled(Grid)(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
        marginBottom: theme.spacing(2),
    },
}));

export default function Home() {
    const theme = useTheme();
    const [page, setPage] = React.useState(1);
    const totalPages = 5;

    const handlePageChange = (event, value) => {
        setPage(value);
        // Fetch new data based on the selected page
    };

    return (
        <>
            <Box>
                <Container maxWidth="lg">
                    <Box my={4}>
                        <Paper sx={{ py: 2 }}>
                            <Box p={2}>
                                <Typography variant="h2" align="center">
                                    Welcome to Our E-commerce Store
                                </Typography>
                            </Box>
                            <Box my={4}>
                                <FeaturedSwiper />
                            </Box>
                        </Paper>

                        <Box my={4}>
                            <PromoSection />
                        </Box>
                    </Box>

                    <Grid container spacing={2}>
                        {categories.map((category) => (
                            <CustomGrid item xs={12} sm={6} md={4} lg={3} key={category.id}>
                                <Card>
                                    <CardActionArea>
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={category.image}
                                            alt={category.name}
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {category.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {category.description}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                    <CardActions>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<AddShoppingCartIcon />}
                                            onClick={() => {
                                                // Handle the add to cart action here
                                            }}
                                        >
                                            Add to Cart
                                        </Button>
                                    </CardActions>
                                </Card>
                            </CustomGrid>
                        ))}
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
