import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import Cookies from 'js-cookie';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

import ResetPasswordForm from '../components/auth/ResetPasswordForm'
export default function ResetPasswordPage() {
    const [formData, setFormData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [successAlert, setSuccessAlert] = useState(false);
    const [errorAlert, setErrorAlert] = useState(false);
    const [errorAlertMessage, setErrorAlertMessage] = useState('');
    const navigate = useNavigate();
    // Get the token from the URL
    const location = useLocation();
    const token = new URLSearchParams(location.search).get('token');


    // Here you can handle the password reset process
    const resetPasswordHandler = async (resetPasswordData) => {
        // Implement the API call to your backend to reset the password
        const authToken = Cookies.get('token');
        setSuccessAlert(false);
        setErrorAlert(false);
        setIsLoading(true);

        try {

            const response = await axios.post(`http://localhost:5000/api/auth/resetPassword`, {
                token: authToken,
                otp: resetPasswordData.otp,
                password: resetPasswordData.password,
            })

            if (response.status === 200 || response.status === 201) {
                setSuccessAlert(true);
                setFormData(token, resetPasswordData.otp, resetPasswordData.password);
                setIsLoading(false);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setErrorAlert(true);
                setErrorAlertMessage('An error occurred while updating the password');
                setIsLoading(false);
            }

        } catch (error) {
            console.log('Error:', error);
            setErrorAlert(true);
            setErrorAlertMessage('Error updating password');
            setIsLoading(false);
        }
    }
    return (
        <div>
            <ResetPasswordForm onResetPassword={resetPasswordHandler}
                successAlert={successAlert}
                setSuccessAlert={setSuccessAlert} />
        </div>
    )
}
