import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import RegisterForm from '../../components/auth/RegisterForm'
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';


export default function RegisterPage() {
    // eslint-disable-next-line
    const [formData, setFormData] = useState(null);
    // eslint-disable-next-line
    const [isLoading, setIsLoading] = useState(false);
    const [successAlert, setSuccessAlert] = useState(false);
    const [errorAlert, setErrorAlert] = useState(false);
    const [errorAlertMessage, setErrorAlertMessage] = useState('');
    const navigate = useNavigate();

    const addRegisterHandler = async (registerData) => {
        setSuccessAlert(false);
        setErrorAlert(false);
        setIsLoading(true);
        try {
            const response = await axios.post(`http://localhost:5000/api/users/`, registerData);

            if (response.status === 200 || response.status === 201) {
                setFormData(registerData);
                setSuccessAlert(true);

                setTimeout(() => {
                    navigate('/email-sent');
                }, 2000);
            }
        } catch (error) {
            console.log('Error:', error);
            if (error.response && error.response.data && error.response.data.msg && error.response.data.msg === 'user already exists') {
                setErrorAlert(true);
                setErrorAlertMessage('A user with this email already exists');
            } else {
                setErrorAlert(true);
                setErrorAlertMessage('Error saving data to server');
            }

        } finally {
            setIsLoading(false);
        }
    }
    return (
        <>
            {successAlert && (
                <Stack sx={{ width: '100%' }} spacing={2}>
                    <Alert variant="filled" severity="success">
                        Registration successful
                    </Alert>
                </Stack>
            )}
            {errorAlert && (
                <Stack sx={{ width: '100%' }} spacing={2}>
                    <Alert variant="filled" severity="error">
                        {errorAlertMessage}
                    </Alert>
                </Stack>
            )}
            <RegisterForm
                onAddRegister={addRegisterHandler} />

        </>
    )
}
