import React, { useState } from 'react'
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';


export default function PaymentGateWay(props) {
    const [email, setEmail] = useState('');
    const [amount, setAmount] = useState('');

    const handleFormSubmit = (event) => {
        event.preventDefault();
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            console.error('Invalid amount value:', amount);
            return;
        }

        const paymentData = {
            email: email,
            amount: Math.round(parsedAmount * 100),
        };
        console.log('Submitting payment data:', paymentData);
        props.onAddPayment(paymentData);
    }

    return (
        <>
            <Container maxWidth="sm">
                <form onSubmit={(e) => handleFormSubmit(e)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Email"
                                type="email"
                                value={email}
                                fullWidth
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Amount (NGN)"
                                type="number"
                                value={amount}
                                fullWidth
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                fullWidth
                            >
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Container>
        </>
    )
}
