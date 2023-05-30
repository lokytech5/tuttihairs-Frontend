import React from 'react';
import { Container, Grid, Typography, Box, Avatar, useMediaQuery, Card, CardContent, useTheme, Divider } from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)(({ theme }) => ({
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
}));

const Line = styled('hr')({
    border: 0,
    height: '1px',
    backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0))',
});

export default function AboutMe() {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('md'));
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const history = [
        { year: 2023, event: "Our journey began with a simple idea." },
        { year: 2024, event: "We grew into a small team." },
        { year: 2025, event: "Launched our mobile application." },
        // Add more events here
    ];

    return (
        <Container maxWidth="lg">
            <Box mt={5} mb={5}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                        <StyledCard>
                            <Avatar
                                alt="Owner"
                                src={require('../../assets/tuti-5.png')}
                                sx={{ width: 200, height: 200, margin: 'auto' }}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Adaeze, Owner
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    CEO
                                </Typography>
                            </CardContent>
                        </StyledCard>
                    </Grid>
                    <Grid item xs={12} sm={6} md={8}>
                        <StyledCard>
                            <CardContent>
                                <Typography variant={matches ? "h4" : "h6"} gutterBottom>
                                    Our Story
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Welcome to our e-commerce platform. We started our journey in 2023. Our mission is to provide the best service possible. We constantly strive to improve our services and believe in customer satisfaction. We hope you enjoy your shopping experience with us.
                                </Typography>
                            </CardContent>
                        </StyledCard>
                        <Box mt={4}>
                            <StyledCard>
                                <CardContent>
                                    <Typography variant={matches ? "h4" : "h6"} gutterBottom>
                                        Our Journey
                                    </Typography>
                                    {history.map((item, index) => (
                                        <Box key={index} my={2}>
                                            <Typography variant="h6" component="span">
                                                {item.year}
                                            </Typography>
                                            <Typography>{item.event}</Typography>
                                            {index !== history.length - 1 && <Line />}
                                        </Box>
                                    ))}
                                </CardContent>
                            </StyledCard>
                        </Box>
                        <Box mt={4}>
                            <StyledCard>
                                <CardContent>
                                    <Typography variant={matches ? "h4" : "h6"} gutterBottom>
                                        Our Training Classes
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Welcome to our e-commerce platform. We started our journey in 2023. Our mission is to provide the best service possible. We constantly strive to improve our services and believe in customer satisfaction. We hope you enjoy your shopping experience with us.
                                    </Typography>
                                </CardContent>
                            </StyledCard>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};




