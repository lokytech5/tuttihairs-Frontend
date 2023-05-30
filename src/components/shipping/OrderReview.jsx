import React, { useState, useEffect } from 'react'
import useOrder from '../../hooks/useOrder'
import { useParams } from 'react-router-dom';
import { Typography, Box, Button, CircularProgress, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from "@mui/system";
import { useNavigate } from 'react-router-dom';


const OrderReviewButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(3, 0, 2),
}));

export default function OrderReview() {
    let { orderId } = useParams();
    const [id, setId] = useState(orderId || localStorage.getItem('orderId') || '');
    const { fetchOrderById, order, loading, error } = useOrder();
    const navigate = useNavigate();
    

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

    const columns = [
        { field: 'id', headerName: 'Product ID', width: 150 },
        { field: 'name', headerName: 'Product Name', width: 250 },
        { field: 'price', headerName: 'Price', width: 150 },
        { field: 'quantity', headerName: 'Quantity', width: 150 },
        { field: 'subtotal', headerName: 'Subtotal', width: 150 },
    ];

    let rows = [];
    if (order && Array.isArray(order.items)) {
        rows = order.items.map(item => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            subtotal: item.subtotal
        }));
    }

    const handlePayment = () => {
        navigate('/payment')
    }

    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <Typography variant="h5" component="div" gutterBottom>
                Order Review
            </Typography>
            <Typography variant="h6" component="div" gutterBottom>
                Order ID: {order && order.id}
            </Typography>

            <Typography variant="h6" component="div" gutterBottom alignItems='center'>
                {order.shipping && <div>Shipping Cost: {order.shipping.cost}</div>}
            </Typography>

            <Typography variant="h6" component="div" gutterBottom>
                Total Price: {order && order.totalPrice}
            </Typography>
            <DataGrid rows={rows} columns={columns} />

            <OrderReviewButton type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={handlePayment}>
                Proceed to Payment
            </OrderReviewButton>
        </Box>
    )
}
