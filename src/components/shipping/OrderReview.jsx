import React, { useEffect } from 'react'
import useOrder from '../../hooks/useOrder'
import { useParams } from 'react-router-dom';
import { Typography, Box, CircularProgress, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

export default function OrderReview() {
    const { orderId } = useParams();
    const { fetchOrderById, order, loading, error} = useOrder();

    useEffect(() => {
        fetchOrderById(orderId);
    }, [orderId, fetchOrderById]);

    if(loading){
        return <CircularProgress/>
    }

    if(error){
        return <Alert severity="error">{error}</Alert>;  
    }

    const columns = [
        { field: 'id', headerName: 'Product ID', width: 150 },
        { field: 'name', headerName: 'Product Name', width: 250 },
        { field: 'price', headerName: 'Price', width: 150 },
        { field: 'quantity', headerName: 'Quantity', width: 150 },
        { field: 'subtotal', headerName: 'Subtotal', width: 150 },
    ];

    const rows = order.items.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        subtotal: item.subtotal
    }));

  return (
      <Box sx={{ height: 400, width: '100%' }}>
          <Typography variant="h5" component="div" gutterBottom>
              Order Review
          </Typography>
          <Typography variant="h6" component="div" gutterBottom>
              Order ID: {order.id}
          </Typography>
          <Typography variant="h6" component="div" gutterBottom>
              Total Price: {order.totalPrice}
          </Typography>
          <DataGrid rows={rows} columns={columns} />
      </Box>
  )
}
