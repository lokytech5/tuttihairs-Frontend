import React, { useState } from 'react'
import { Typography, Container, Box, FormControlLabel, TextField, Switch, Button, Paper, Modal } from '@mui/material';
import { styled } from "@mui/system";
import { useTheme } from '@mui/material/styles';
import { Snackbar, Alert } from '@mui/material';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'


const PreferencesPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));

const FormContainer = styled('div')(({ theme }) => ({
    width: '100%',
    marginTop: theme.spacing(1),
}));

const SaveButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(3, 0, 2),
}));

const SavePreferenceButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(3, 0, 2),
}));

const DeleteButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(3, 0, 2),
    backgroundColor: theme.palette.error.main,
    color: 'white',
    '&:hover': {
        backgroundColor: theme.palette.error.dark,
    },
}));

const DeleteModal = styled(Modal)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const DeleteModalContent = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
}));

const formValidationSchema = z.object({
    currentPassword: z.string().nonempty('CurrentPassword field is required'),
    newPassword: z.string().nonempty('NewPassword field is required')
})

export default function UserSetting(props) {
    const [snackbarError, setSnackbarError] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [passwordValue, setPasswordValue] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const theme = useTheme();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(formValidationSchema)
    });

    const handleModalOpen = () => {
        setDeleteModalOpen(true);
    };

    const handleModalClose = () => {
        setDeleteModalOpen(false);
    };

    const handleDeleteAccountWithPassword = (password) => {
        // Perform the password verification and account deletion process
        props.onDeleteAccount(password, () => {
            // Success callback: Close the modal after successful deletion
            handleModalClose();
        }, () => {
            // Failure callback: Show the incorrect password error
            setPasswordError("Incorrect password. Please try again.");
        });
    };

    const handleChangePasswordSubmit = (data) => {
        console.log('Change password form submitted:', data);
        // Dummy check to simulate checking against the previous password
        props.onVerifyAndUpdatePassword(data, () => {
            setSnackbarError('');
        }, () => {
            setSnackbarError('The current password is incorrect.');
        });
      
    };

    const handleSavePreferencesClick = (event) => {
        event.preventDefault();
        const formData = new FormData(document.getElementById('notificationPreferencesForm'));
        const data = {
            emailNotifications: formData.get('emailNotifications') === 'true',
            pushNotifications: formData.get('pushNotifications') === 'true',
        };
        props.notificationPreference(data);
    };

    return (
        <>
            <Container
                component="main"
                maxWidth="xs"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    padding: 0,
                    backgroundColor: theme.palette.background.default
                }}
            >
                <PreferencesPaper sx={{ marginBottom: 2 }}>
                    <Typography component="h1" variant="h5">
                        Notification Preferences
                    </Typography>

                    <form id="notificationPreferencesForm">
                        <FormContainer>
                            <FormControlLabel
                                control={
                                    <Switch
                                        color="primary"
                                        name="emailNotifications"
                                        {...register('emailNotifications')}
                                    />
                                }
                                label="Email Notifications"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        color="primary"
                                        name="pushNotifications"
                                        {...register('pushNotifications')}
                                    />
                                }
                                label="Push Notifications"
                            />
                            <SavePreferenceButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={handleSavePreferencesClick}
                            >
                                Save Preferences
                            </SavePreferenceButton>

                        </FormContainer>
                    </form>
                </PreferencesPaper>


                <PreferencesPaper>
                    <Typography component="h1" variant="h5">
                        Change Password
                    </Typography>
                    <form onSubmit={handleSubmit(handleChangePasswordSubmit)}>
                        <FormContainer>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="currentPassword"
                                label="Current Password"
                                type="password"
                                id="currentPassword"
                                autoComplete="current-password"
                                {...register('currentPassword')}
                                error={errors.currentPassword ? true : false}
                                helperText={errors.currentPassword ? errors.currentPassword.message : ''}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="newPassword"
                                label="New Password"
                                type="password"
                                id="newPassword"
                                autoComplete="new-password"
                                {...register('newPassword')}
                                error={errors.newPassword ? true : false}
                                helperText={errors.newPassword ? errors.newPassword.message : ''}

                            />
                            <SaveButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                            >
                                Change Password
                            </SaveButton>
                        </FormContainer>
                    </form>
                </PreferencesPaper>
                <DeleteButton
                    fullWidth
                    variant="contained"
                    onClick={handleModalOpen}
                >
                    Delete Account
                </DeleteButton>

                <DeleteModal
                    open={deleteModalOpen}
                    onClose={handleModalClose}
                    aria-labelledby="delete-account-modal-title"
                    aria-describedby="delete-account-modal-description"
                >
                    <DeleteModalContent>
                        <Typography id="delete-account-modal-title" variant="h6" component="h2">
                            Confirm Password to Delete Account
                        </Typography>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Password"
                            type="password"
                            id="confirmPassword"
                            autoComplete="current-password"
                            onChange={(event) => setPasswordValue(event.target.value)}
                        />
                        {passwordError && (
                            <Typography color="error" variant="body2">
                                {passwordError}
                            </Typography>
                        )}
                        <Button onClick={() => handleDeleteAccountWithPassword(passwordValue)}>
                            Delete Account
                        </Button>
                        <Button onClick={handleModalClose}>
                            Cancel
                        </Button>
                    </DeleteModalContent>
                </DeleteModal>
            </Container>

            {/* Success changePassword Snackbar */}
            <Snackbar
                open={props.openSnackbar}
                autoHideDuration={6000}
                onClose={props.handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert onClose={props.handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    Password updated successfully!
                </Alert>
            </Snackbar>

            {/* failed chnagePassword Snackbar */}
            <Snackbar
                open={snackbarError !== ''}
                autoHideDuration={6000}
                onClose={() => setSnackbarError('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert onClose={() => setSnackbarError('')} severity="error" sx={{ width: '100%' }}>
                    {snackbarError}
                </Alert>
            </Snackbar>

            {/* Success deleteAccount Snackbar */}
            <Snackbar
                open={props.successSnackbarOpen}
                autoHideDuration={6000}
                onClose={props.handleSuccessSnackbarClose}
            >
                <Alert onClose={props.handleSuccessSnackbarClose} severity="success">
                    Password verification successful
                </Alert>
            </Snackbar>

            {/* Failed deleteAccount Snackbar */}
            <Snackbar
                open={props.failureSnackbarOpen}
                autoHideDuration={6000}
                onClose={props.handleFailureSnackbarClose}
            >
                <Alert onClose={props.handleFailureSnackbarClose} severity="error">
                    Password verification failed
                </Alert>
            </Snackbar>

            {/* Success Preference Snackbar */}
            <Snackbar
                open={props.preferencesSuccessSnackbarOpen}
                autoHideDuration={6000}
                onClose={props.handlePreferencesSuccessSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert onClose={props.handlePreferencesSuccessSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    Preferences saved successfully!
                </Alert>
            </Snackbar>

            {/* Failed Preference Snackbar */}
            <Snackbar
                open={props.preferencesFailureSnackbarOpen}
                autoHideDuration={6000}
                onClose={props.handlePreferencesFailureSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert onClose={props.handlePreferencesFailureSnackbarClose} severity="error" sx={{ width: '100%' }}>
                    Failed to save preferences!
                </Alert>
            </Snackbar>
        </>
    )
}
