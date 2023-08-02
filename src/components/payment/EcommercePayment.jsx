/* global PaystackPop */
import React, { useState, useEffect } from 'react'
import { Alert, CircularProgress, Card, Box, CardContent, Typography, Button } from '@mui/material';
import useOrder from '../../hooks/useOrder';
import usePayment from '../../hooks/usePayment';
import useStore from '../../zustand/store'
import usePaystackPayment from '../../hooks/usePaystackPayment';

export default function EcommercePayment() {
    const orderId = localStorage.getItem('orderId');
    const userEmail = useStore((state) => state.userEmail);
    const clearCart = useStore(state => state.clearCart);
    const [payStackPopupClosed, setPayStackPopupClosed] = useState(false);
    const { paymentGateWayHandler, loading: paymentLoading, error: paymentError,
        verifyTransactionHandler, } = usePayment('ecommerce');
    const { completePurchaseHandler, fetchOrderById, order, loading, error } = useOrder();
    const totalAmount = order && order.totalPrice;  // replace with actual total amount
    const props = {
        userEmail,
        totalAmount,
        paymentGateWayHandler,
        verifyTransactionHandler,
        callbackUrl: completePurchaseHandler, // here you pass the completePurchaseHandler
        orderId,
        clearCart 
    }
    const { payWithPaystack } = usePaystackPayment(props)

    useEffect(() => {
        fetchOrderById(orderId); // replace "orderId" with the actual order ID
    }, [fetchOrderById]);

    if (loading) {
        return <CircularProgress />
    }
    if (paymentLoading) {
        return <CircularProgress />
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }
    if (paymentError) {
        return <Alert severity="error">{paymentError}</Alert>;
    }

    if (payStackPopupClosed) {
        return <Alert severity="error">Your transaction was not completed. Please try again.</Alert>;
    }

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh', // to take full viewport height
                }}
            >
                <Card sx={{ maxWidth: 345, height: '70vh', boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .3)', p: 2 }}>
                    <CardContent
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            height: '100%',
                            pt: 2, // padding-top
                            pb: 2, // padding-bottom
                        }}>
                        <Typography variant="h1" component="div" gutterBottom
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100vh',
                            }}
                        >
                            Total Amount
                            <Box
                                sx={{
                                    fontSize: '2.5rem',
                                    fontWeight: 'bold'
                                }}
                            >
                                #{totalAmount}
                            </Box>
                        </Typography>
                        <Button variant="contained" color="primary" onClick={payWithPaystack} sx={{ p: 1, mb: 8, fontSize: '1.2rem', transition: '0.3s', '&:hover': { backgroundColor: '#ff8f00' } }}>
                            Pay with Paystack

                        </Button>
                    </CardContent>
                </Card>
            </Box>

        </>
    );

}
