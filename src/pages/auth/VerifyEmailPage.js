import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Alert, Typography } from '@mui/material';
import axios from 'axios'

export default function VerifyEmailPage() {
    const [formData, setFormData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorAlert, setErrorAlert] = useState(false);
    const [errorAlertMessage, setErrorAlertMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

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
            if(response.status === 200 || response.status === 201){
                setIsLoading(false);
                setSuccess(true);
                setTimeout(() => {
                    navigate('/login');
                }, 3000); // navigate after 3 seconds
            } else if (response.status === 400) {
                setErrorAlert(true);
                setErrorAlertMessage('Invalid token');
                setIsLoading(false);
            } else if (response.status === 404) {
                setErrorAlert(true);
                setErrorAlertMessage('User not found');
                setIsLoading(false);
            } else {
                setErrorAlert(true);
                setErrorAlertMessage('Unknown error occurred');
                setIsLoading(false);
            }  
        } catch (error) {
            console.log('Error:', error);
            setErrorAlert(true);
            setErrorAlertMessage('Invalid email address');
            setIsLoading(false);
        }
    } 
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            height="100vh"
            gap={2}
        >
            {isLoading && <CircularProgress />}
            {errorAlert && <Alert severity="error">{errorAlertMessage}</Alert>}
            {success &&
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <Typography variant="h5" gutterBottom>
                        Email Verified Successfully!
                    </Typography>
                    <Typography variant="body1">
                        Redirecting to login page...
                    </Typography>
                </Box>
            }
        </Box>
    )
}
