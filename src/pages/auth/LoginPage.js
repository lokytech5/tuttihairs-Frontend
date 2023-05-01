import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import useStore from '../../zustand/store'
import LoginForm from '../../components/auth/LoginForm'
import { authRequest } from '../../utility/api/auth';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
export default function LoginPage() {
    const [formData, setFormData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [successAlert, setSuccessAlert] = useState(false);
    const [errorAlert, setErrorAlert] = useState(false);
    const [errorAlertMessage, setErrorAlertMessage] = useState('');
    const navigate = useNavigate();
    const setAuthenticated = useStore((state) => state.setAuthenticated);
    const setUsername = useStore((state) => state.setUsername);
    const loadUser = useStore((state) => state.loadUser);


    const addLoginHandler = async (loginData) => {
        console.log("logindata username", loginData.username);

        setSuccessAlert(false);
        setErrorAlert(false);
        setIsLoading(true);
        try {
            const response = await authRequest(loginData.username, loginData.password);

            if (response.status === 200 || response.status === 201) {

                setFormData(loginData);
                setSuccessAlert(true);
                const username = loginData.username
                const token = response.data.token;
                const decodedToken = jwt_decode(token);
                const userId = decodedToken._id;
                console.log('Decoded Token:', decodedToken);
                const avatar = response.data.avatar;

                setAuthenticated(true, avatar);
                useStore.getState().setUserId(userId);
                setUsername(username);
                console.log("Username set in store:", useStore.getState().username);
                loadUser(token);



                setTimeout(() => {
                    navigate('/');
                }, 2000); // Wait for 2 seconds before navigating

            }
        } catch (error) {
            console.log('Error:', error);
            if (error.response.status === 400) {
                setErrorAlert(true);
                setErrorAlertMessage('Invalid username or password');
            } else {
                setErrorAlert(true);
                setErrorAlertMessage('Error sending data to server');
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
                        Logged in successfully as {formData.username}
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
            <LoginForm
                onAddLogin={addLoginHandler} />
        </>
    )
}
