import React, { useState } from 'react'
import useCategories from '../../hooks/useCategories'
import {
    Card,
    CardActionArea,
    CardContent,
    CardActions,
    CardMedia,
    Typography,
    Button,
    Grid,
    Box,
} from '@mui/material';
import Pagination from '@mui/material/Pagination';
import { useTheme } from '@mui/material/styles';
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
    const theme = useTheme();



    const handleViewProducts = (categoryId) => {
        navigate(`/categories/${categoryId}`);
    };

    return (
        <>
            {categories.map((category) => (
                <CustomGrid item xs={12} sm={6} md={4} lg={3} key={category._id}>
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
                        <CardActions sx={{ justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                color="primary"
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
