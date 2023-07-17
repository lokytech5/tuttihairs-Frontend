import React, { useState } from 'react'
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  CircularProgress,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  useTheme,
} from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

import { styled } from "@mui/system";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import PermPhoneMsgIcon from '@mui/icons-material/PermPhoneMsg';
import useTrainingClass from '../../hooks/useTrainingClass';
import { useNavigate } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const TrainingClassPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const FormContainer = styled("div")(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(1),
}));

const TrainingClassButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}));

const formValidationSchema = z.object({
  verificationCode: z.string().nonempty("must not be empty")
})

const VerificationPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

export default function TrainingClassPhoneVerifyForm() {
  const [successAlert, setSuccessAlert] = useState(false);
  const [verificationInProgress, setVerificationInProgress] = useState(false);
  const [verificationAttempted, setVerificationAttempted] = useState(false);
  const theme = useTheme();
  const [isVerified, setIsVerified] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formValidationSchema)
  });
  const navigate = useNavigate();
  const { fetchVerifyPhoneNumber, loading, error } = useTrainingClass();

  if (loading) {
    return <CircularProgress />
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const handleFormSubmit = async (data, event) => {
    setVerificationInProgress(true);
    setVerificationAttempted(true);
    const verificationResponse = await fetchVerifyPhoneNumber(data.verificationCode);
    setVerificationInProgress(false);
    if (verificationResponse) {
      setIsVerified(true);
      setTimeout(() => {
        navigate('/trainingConfirmation');
      }, 3000);
    } else {
      setIsVerified(false)
    }
  }

  return (
    <>


      <Container
        component="main"
        maxWidth="xs"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: 0,
          backgroundColor: theme.palette.background.default,
        }}
      >

        <TrainingClassPaper>
          <Avatar
            sx={{ margin: 1, backgroundColor: theme.palette.primary.main }}
          >
            <PermPhoneMsgIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Verifiy Phone Number
          </Typography>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <FormContainer>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id='verificationCode'
                name='verificationCode'
                label='Enter verification Code'
                autoComplete='verificationCode'
                autoFocus
                {...register('verificationCode')}
                helperText={errors.verificationCode?.message}
                error={Boolean(errors.verificationCode)}
              />
              <TrainingClassButton
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Verifiy Code
              </TrainingClassButton>
            </FormContainer>
          </form>
        </TrainingClassPaper>
        {successAlert && (
          <Stack sx={{ width: "100%" }} spacing={2}>
            <Alert variant="filled" severity="success">
              Verification successfully
            </Alert>
          </Stack>
        )}

        <Dialog
          open={verificationAttempted}
          onClose={() => setVerificationAttempted(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {verificationInProgress ? 'Verification in progress...' : isVerified ? 'Phone Verified!' : 'Verification Failed'}
          </DialogTitle>
          <DialogContent>
            <Box display="flex" justifyContent="center">
              <Avatar
                sx={{ margin: 1, backgroundColor: isVerified ? theme.palette.success.main : theme.palette.error.main }}
              >
                {verificationInProgress ? <CircularProgress /> : isVerified ? <CheckCircleOutlineIcon /> : <ErrorOutlineIcon />}
              </Avatar>
            </Box>
            <DialogContentText id="alert-dialog-description">
              {verificationInProgress
                ? 'Please wait, your phone number is being verified...'
                : isVerified
                  ? 'Your phone has been successfully verified! You can now register for the class.'
                  : 'Verification failed. Please re-enter your phone number and try again.'}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setVerificationAttempted(false)} color="primary">
              Close
            </Button>
            {!isVerified && (
              <Button component={RouterLink} to="/trainingPhoneForm" color="primary" autoFocus>
                Retry
              </Button>
            )}
          </DialogActions>
        </Dialog>

      </Container>

    </>
  )
}
