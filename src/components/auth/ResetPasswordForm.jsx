import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { Link as RouterLink } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';

import {
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Avatar,
} from '@mui/material';
import { styled } from '@mui/system';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const ResetPasswordPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));

const FormContainer = styled('div')(({ theme }) => ({
    width: '100%',
    marginTop: theme.spacing(1),
}));

const ResetPasswordButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(3, 0, 2),
}));

const formValidationSchema = z.object({
    otp: z.string().nonempty('Otp is required'),
    newPassword: z.string().nonempty('Password is required'),
    confirmPassword: z.string().nonempty('Confirmed Password is required')
})

export default function ResetPasswordForm({ onResetPassword, successAlert, setSuccessAlert }) {
    const { register, handleSubmit, getValues, setError, formState: { errors } } = useForm({
        resolver: zodResolver(formValidationSchema)
    });
    const theme = useTheme();
    const navigate = useNavigate();

    //*Validating Password
    const validatePassword = () => {
        if (getValues('newPassword') !== getValues('confirmPassword')) {
            setError('confirmPassword', {
                type: 'manual',
                message: 'Passwords do not match',
            });
            return false;
        }
        return true;
    };

    const handleFormSubmit = (data) => {
        if (!validatePassword()) {
            return;
        }
        const resetPasswordData = {
            otp: data.otp,
            password: data.newPassword,
        }
        onResetPassword(resetPasswordData);
        setSuccessAlert(true);

        setTimeout(() => {
            navigate('/login');
        }, 2000);
    };


    return (
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
            }}>
            <ResetPasswordPaper>
                <Avatar sx={{ margin: 1, backgroundColor: theme.palette.primary.main }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Reset Password
                </Typography>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <FormContainer>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="otp"
                            label="One-Time Password (OTP)"
                            name="otp"
                            autoFocus
                            {...register('otp')}
                            error={errors.otp ? true : false}
                            helperText={errors.otp ? errors.otp.message : ''}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="newPassword"
                            label="New Password"
                            name="newPassword"
                            autoComplete="password"
                            type="password"
                            {...register('newPassword')}
                            error={errors.newPassword ? true : false}
                            helperText={errors.newPassword ? errors.newPassword.message : ''}
                        />

                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="confirmPassword"
                            label="Confirm New Password"
                            type="password"
                            name="confirmPassword"
                            autoComplete="confirm-password"
                            {...register('confirmPassword')}
                            error={errors.confirmPassword ? true : false}
                            helperText={
                                errors.confirmPassword ? errors.confirmPassword.message : ''
                            }
                        />
                        <ResetPasswordButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                        >
                            Reset Password
                        </ResetPasswordButton>
                    </FormContainer>
                </form>
                <RouterLink to="/login" style={{ textDecoration: 'none' }}>
                    <Link href="/login" variant="body2">
                        Back to Login
                    </Link>
                </RouterLink>
            </ResetPasswordPaper >
            {successAlert && (
                <Stack sx={{ width: "100%" }} spacing={2}>
                    <Alert variant="filled" severity="success">
                        Sucessfully changed password
                    </Alert>
                </Stack>
            )}
        </Container >
    )
}
