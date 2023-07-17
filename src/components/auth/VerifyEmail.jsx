import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Link as RouterLink } from "react-router-dom";
import { CircularProgress, Container, Typography, Paper, Avatar, useTheme, Link } from '@mui/material';
import { styled } from "@mui/system";
import axios from 'axios'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';


const VerificationPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

export default function VerifyEmail(props) {
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [errorAlertMessage, setErrorAlertMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

    if (token) {
      verifyEmailHandler(token);
    }
  }, [location]);

  const verifyEmailHandler = async (token) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`http://localhost:5000/api/auth/verify`, { token })
      if (response.status === 200 || response.status === 201) {
        setIsVerified(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000); // navigate after 3 seconds
      } else {
        setErrorAlert(true);
        setErrorAlertMessage('Unknown error occurred');
      }
    } catch (error) {
      setErrorAlert(true);
      setErrorAlertMessage('There was an issue verifying your email. Please try again.');
    } finally {
      setIsLoading(false);
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
        <VerificationPaper>
          <Avatar
            sx={{ margin: 1, backgroundColor: isVerified ? theme.palette.success.main : theme.palette.error.main }}
          >
            {isVerified ? <CheckCircleOutlineIcon /> : <ErrorOutlineIcon />}
          </Avatar>
          <Typography component="h1" variant="h5">
            {isLoading ? 'Verifying...' : isVerified ? 'Email Verified!' : 'Verification Failed'}
          </Typography>
          {!isLoading && (
            <>
              <Typography variant="body1" align="center">
                {isVerified
                  ? 'Your email has been successfully verified! You can now login.'
                  : 'Verification failed. Please check the link or request a new one.'}
              </Typography>
              <Link component={RouterLink} to="/login" variant="body2" align="center">
                Back to Login
              </Link>
            </>
          )}
          {isLoading && <CircularProgress />}
        </VerificationPaper>
      </Container>
    </>
  )
}
