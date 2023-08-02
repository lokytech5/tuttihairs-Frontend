import React from 'react'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';

const PaymentDialog = ({ open, handleClose, trainingClassOrder, handlePayment }) => {
  return (
      <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
      >
          <DialogTitle id="alert-dialog-title">{"Order Details"}</DialogTitle>
          <DialogContent>
              {trainingClassOrder}
          </DialogContent>
          <DialogActions>
              <Button onClick={handleClose} color="primary">
                  Close
              </Button>
              {!trainingClassOrder.isPaid && (
                  <Button onClick={handlePayment} color="primary" autoFocus>
                      Pay with Stack
                  </Button>
              )}
          </DialogActions>
      </Dialog>
  );
}

export default PaymentDialog