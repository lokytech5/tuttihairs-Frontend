import React, { useEffect } from 'react'
import useTrainingClass from '../../hooks/useTrainingClass'
import useStore from '../../zustand/store';
import {
  Alert,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from '@mui/material';
export default function TrainingClassOrder() {
  const { loading, error } = useTrainingClass();
  const trainingClassOrder = useStore((state) => state.trainingClassOrder);

  if (loading) {
    console.log('Loading...');
    return <CircularProgress />;
  }

  if (error || !trainingClassOrder) {
    console.log('Error or no data:', error);
    return <Alert severity="error">{error}</Alert>;
  }


  console.log('Rendering with data:', trainingClassOrder);

  return (
    <Card>
      <CardContent>
        {console.log(trainingClassOrder)}
        <Typography color="textSecondary" gutterBottom>
          Order ID: {trainingClassOrder?._id}
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
              ? trainingClassOrder.services.map(service => service.name).join(", ")
              : "No services added"
          }
        </Typography>
        <Typography variant="body2" component="p">
          Total Cost: {trainingClassOrder.totalCost}
        </Typography>
        <Typography color="textSecondary">
          Payment Status: {trainingClassOrder.isPaid ? "Paid" : "Not Paid"}
        </Typography>
        <Typography variant="body2" component="p">
          Order Date: {new Date(trainingClassOrder.date).toLocaleDateString()}
        </Typography>
      </CardContent>
    </Card>
  )
}
