import React from 'react';
import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function CuratedCollection({ collection }) {
    const navigate = useNavigate();

    const handleViewCollection = (collectionId) => {
        navigate(`/collection/${collectionId}`);
    };

    return (
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card>
                <CardActionArea >
                    <CardMedia component="img" height="200" image={collection.bannerImage} alt={collection.name} />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {collection.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {collection.description}
                        </Typography>
                    </CardContent>
                </CardActionArea>

                <CardActions sx={{ justifyContent: 'center', mb: 2 }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<VisibilityIcon />}
                        onClick={() => handleViewCollection(collection._id)}
                            >
                                View Products
                            </Button>
                        </CardActions>
            </Card>
        </Grid>
    );
}
