import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm'
import axios from 'axios'

export default function ForgotPasswordPage() {
    // eslint-disable-next-line
    const [formData, setFormData] = useState(null);
    // eslint-disable-next-line
    const [isLoading, setIsLoading] = useState(false);
    const [successAlert, setSuccessAlert] = useState(false);
    // eslint-disable-next-line
    const [errorAlert, setErrorAlert] = useState(false);
    // eslint-disable-next-line
    const [errorAlertMessage, setErrorAlertMessage] = useState('');
    const navigate = useNavigate();


    const forgotPasswordHandler = async (forgotPasswordData) => {
        setSuccessAlert(false);
        setErrorAlert(false);
        setIsLoading(true);
        try {
            const response = await axios.post(`http://localhost:5000/api/auth/forgotPassword`, forgotPasswordData)

            if (response.status === 200 || response.status === 201) {
                setSuccessAlert(true);
                setFormData(forgotPasswordData);
                setIsLoading(false);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setErrorAlert(true);
                setErrorAlertMessage('An error occurred while sending the email');
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
        <>
            <ForgotPasswordForm
                onAddForgotPassword={forgotPasswordHandler}
                successAlert={successAlert}
                setSuccessAlert={setSuccessAlert}
            />

        </>
    )
}
