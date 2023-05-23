import React from 'react'
import {
    Card,
    CardActionArea,
    CardContent,
    CardActions,
    CardMedia,
    Typography,
    Button,
    Grid,
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';

const CustomGrid = styled(Grid)(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
        marginBottom: theme.spacing(2),
    },
}));


export default function Categories({ categories, page }) {
    const navigate = useNavigate();



    const handleViewProducts = (categoryId) => {
        navigate(`/categories/${categoryId}`);
    };

    return (
        <>
            {categories.map((category) => (
                <CustomGrid item xs={12} sm={6} md={4} lg={3} key={category._id}>
                    <Card sx={{minHeight: 300}}>
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
                        <CardActions sx={{ justifyContent: 'center', mb: 2 }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<VisibilityIcon />}
                                onClick={() => handleViewProducts(category._id)}
                            >
                                View Products
                            </Button>
                        </CardActions>
                    </Card>
                </CustomGrid>
            ))}
        </>
    )
}
