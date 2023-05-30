import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import useOrder from '../../hooks/useOrder';
import Alert from '@mui/material/Alert';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { green } from '@mui/material/colors';

export default function PaymentSucessfulPage() {
    let { orderId } = useParams();
    const { fetchOrderById, order, loading, error } = useOrder();
    const [id, setId] = useState(orderId || localStorage.getItem('orderId') || '');

    const urlParams = new URLSearchParams(window.location.search);
    const reference = urlParams.get('reference');

    useEffect(() => {
        let savedOrderId = localStorage.getItem('orderId');
        if (id) {
            localStorage.setItem('orderId', id);
            fetchOrderById(id);
        } else if (savedOrderId) {
            setId(savedOrderId);
            fetchOrderById(savedOrderId);
        }
    }, [id, fetchOrderById]);

    if (loading) {
        return <CircularProgress />
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
            <CheckCircleOutlineIcon style={{ fontSize: 100, color: green[500] }} />
            <Typography variant="h4" component="div" gutterBottom>
                Thank You For shopping with TutiHairs!
            </Typography>
            <Typography variant="h6" component="div" gutterBottom>
                Your transaction was successful.
            </Typography>

            <Typography variant="body1" component="div" gutterBottom>
                <strong>Order ID:</strong> {order && order.id}
            </Typography>

            <Typography variant="body1" component="div" gutterBottom>
                <strong>Reference Number:</strong> {reference}
            </Typography>

            <Typography variant="body1" component="div" gutterBottom>
                <strong>Total Price:</strong> #{order && order.totalPrice}
            </Typography>

            <Typography variant="body1" component="div" gutterBottom>
                <strong>Order Status:</strong> {order && order.status}
            </Typography>


            <Typography variant="body1" component="div" gutterBottom>
                <strong>Ordered Items:</strong>
                {order && order.items ? order.items.map((item )=> (
                    <div key={item.product.id}>
                        {item.product.name} - Quantity: {item.quantity}
                    </div>
                )) : "Loading..."}
            </Typography>

            <Typography variant="body1" component="div" gutterBottom>
                <strong>Shipping Address:</strong>
                {order && order.shipping ? `${order.shipping.address}, ${order.shipping.city}, ${order.shipping.state}, ${order.shipping.postalCode}`: <CircularProgress/>}
            </Typography>


            <Typography variant="body2" component="div" gutterBottom>
                We've sent a receipt to your email address, and we'll notify you when your order is ready to be shipped.
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '50%', mt: 2 }}>
                <Button variant="outlined" color="primary" onClick={() => {/* Track order logic */ }}>
                    Track Your Order
                </Button>
                <Button variant="contained" color="primary" onClick={() => {/* Go back home logic */ }}>
                    Back to Home
                </Button>
            </Box>
        </Box>
    )
}
