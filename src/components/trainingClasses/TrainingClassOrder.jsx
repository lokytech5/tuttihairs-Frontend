import React, { useEffect, useState } from 'react'
import useTrainingClass from '../../hooks/useTrainingClass'
import usePayment from '../../hooks/usePayment';
import usePaystackPayment from '../../hooks/usePaystackPayment';
import useStore from '../../zustand/store';
import {
  Alert,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Skeleton
} from '@mui/material';
export default function TrainingClassOrder() {
  const [payStackPopupClosed, setPayStackPopupClosed] = useState(false);
  const { completeTrainingClassPaymentHandler, loading, error } = useTrainingClass();
  const userEmail = useStore((state) => state.userEmail);
  const { paymentGateWayHandler, loading: paymentLoading, error: paymentError,
    verifyTransactionHandler } = usePayment('training')
  const trainingClassOrder = useStore((state) => state.trainingClassOrder);
  const amount = trainingClassOrder.totalCost
  const trainingClassOrderId = trainingClassOrder?._id

  console.log('Training class order data:', trainingClassOrder);
  console.log('amount', amount)
 

  const props = {
    userEmail,
    amount,
    paymentGateWayHandler,
    verifyTransactionHandler,
    callbackUrl: completeTrainingClassPaymentHandler, // here you pass the completePurchaseHandler
    trainingClassOrderId,
  }
  console.log('Props to Paystack:', props);
  const { payWithPaystack } = usePaystackPayment(props)

  if (loading) {
    return (
      <Skeleton variant="rectangular" width={300} height={300} /> // Skeleton loader for better perceived performance
    );
  }

  if (error || !trainingClassOrder) {
    console.error('An error occurred:', error);
    return <Alert severity="error">{error}</Alert>;
  }

  if (paymentLoading) {
    return <CircularProgress />
  }

  if (paymentError) {
    console.error('Payment error:', paymentError);
    return <Alert severity="error">{paymentError}</Alert>;
  }

  if (payStackPopupClosed) {
    return <Alert severity="error">Your transaction was not completed. Please try again.</Alert>;
  }


  return (
    <Card>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          Order ID: {trainingClassOrderId}
        </Typography>
        <Typography variant="h5" component="h2">
          Training Class: {trainingClassOrder.trainingClass?.title}
        </Typography>
        <Typography color="textSecondary">
          User: {trainingClassOrder.user?.username || 'No user data'}
        </Typography>
        <Typography variant="body2" component="p">
          Services: {
            trainingClassOrder.services && trainingClassOrder.services.length > 0
              ? trainingClassOrder.services.map(service => service.serviceName).join(", ")
              : "No services added"
          }
        </Typography>
        <Typography variant="body2" component="p">
          Total Cost: {amount}
        </Typography>
        <Typography color="textSecondary">
          Payment Status: {trainingClassOrder.isPaid ? "Paid" : "Not Paid"}
        </Typography>
        <Typography variant="body2" component="p">
          Order Date: {new Date(trainingClassOrder.date).toLocaleDateString()}
        </Typography>
      </CardContent>
      <Button variant="contained" onClick={payWithPaystack} color="primary" sx={{ p: 1, mb: 8, fontSize: '1.2rem', transition: '0.3s', '&:hover': { backgroundColor: '#ff8f00' } }}>
        Pay with Paystack

      </Button>
    </Card>
  )
}
