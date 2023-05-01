import { Box, Typography, Button } from '@mui/material';

export default function PromoSection() {
    const promo = {
        title: 'Limited Time Offer',
        description: 'Get 20% off your first order with promo code WELCOME20.',
        buttonText: 'Shop Now',
        // Add any other promo-related data you need
    };

    return (
        <Box
            sx={{
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                padding: 4,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                textAlign: 'center',
            }}
        >
            <Typography variant="h4" component="h4" gutterBottom>
                {promo.title}
            </Typography>
            <Typography variant="body1" gutterBottom>
                {promo.description}
            </Typography>
            <Button variant="contained" onClick={() => { }}>
                {promo.buttonText}
            </Button>
        </Box>
    );
};
