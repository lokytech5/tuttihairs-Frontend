/* global PaystackPop */
import React, { useState, useEffect } from 'react'
import { Alert, CircularProgress, Card, Box, CardContent, Typography, Button } from '@mui/material';
import useOrder from '../../hooks/useOrder';
import usePayment from '../../hooks/usePayment';
import useStore from '../../zustand/store'

export default function PaymentGateWay(props) {
    const { paymentGateWayHandler, payment,
        loading: paymentLoading, error: paymentError,
        verifyTransactionHandler, verification,
        completePurchase, completePurchaseHandler } = usePayment();
    const { fetchOrderById, order, loading, error } = useOrder();
    const totalAmount = order && order.totalPrice;  // replace with actual total amount
    const orderId = localStorage.getItem('orderId');
    const publicKey = 'pk_test_41816d5fd62ebbbab7f98baf69fb824c5e6be916';
    const userEmail = useStore((state) => state.userEmail);
    const clearCart = useStore(state => state.clearCart);
    const [payStackPopupClosed, setPayStackPopupClosed] = useState(false);

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

    const payWithPaystack = async () => {
        // Code to initialize Paystack transaction goes here
        try {
            const paymentData = {
                email: userEmail, // replace with the user's email
                amount: totalAmount,
            };
            // Initialize the transaction on the backend
            const paymentResponse = await paymentGateWayHandler(paymentData);
            console.log(paymentResponse);

            // Get the authorization URL from the response
            const authorizationUrl = paymentResponse.data.authorization_url;

            //Open the Paystack popup
            var handler = PaystackPop.setup({
                key: publicKey, // replace with your public key
                email: userEmail, // replace with the user's email
                amount: totalAmount * 100, // convert to smallest currency unit
                callback: function (response) {
                    // Handle the callback here
                    // For example, you can redirect to a "thank you" page
                    verifyTransactionHandler(response.reference) //verify the transaction using the reference
                    Promise.all([clearCart(), completePurchaseHandler(orderId)])
                        .then(() => {
                            window.location = '/thankyou?reference=' + response.reference;
                        })
                        .catch(err => {
                            console.error('Error verifying transaction:', err.message);
                        })
                },
                onclose: function () {
                    setPayStackPopupClosed(true);
                },
            });

            handler.openIframe();
        } catch (error) {
            console.error('Error initializing Paystack transaction:', error.message);
        }

    };

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
