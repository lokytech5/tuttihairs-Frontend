import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export default function LoginDialog({open, handleClose}) {
    const navigate = useNavigate();
  return (
      <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
      >
          <DialogTitle id="alert-dialog-title">{"Please Log In"}</DialogTitle>
          <DialogContent>
              <DialogContentText id="alert-dialog-description">
                  You need to be logged in to enroll in a class.
              </DialogContentText>
          </DialogContent>
          <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={() => navigate('/login')} autoFocus>
                  Log In
              </Button>
          </DialogActions>
      </Dialog>
  )
}
