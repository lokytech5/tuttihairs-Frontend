import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { Link as RouterLink } from "react-router-dom";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Avatar,
    useTheme,
    Link,
} from "@mui/material";
import { styled } from "@mui/system";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

const ForgotPasswordPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
}));

const FormContainer = styled("div")(({ theme }) => ({
    width: "100%",
    marginTop: theme.spacing(1),
}));

const ForgotPasswordButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(3, 0, 2),
}));

const formValidationSchema = z.object({
    email: z.string().nonempty('Email is required')
})

export default function ForgotPasswordForm({ onAddForgotPassword, successAlert, setSuccessAlert }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(formValidationSchema)
    });

    const theme = useTheme();

    const handleFormSubmit = (data) => {
        const forgotPasswordData = {
            email: data.email,
        }
        onAddForgotPassword(forgotPasswordData);
        setSuccessAlert(true);
    };

    return (
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
            <ForgotPasswordPaper>
                <Avatar
                    sx={{ margin: 1, backgroundColor: theme.palette.primary.main }}
                >
                    <MailOutlineIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Forgot Password
                </Typography>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <FormContainer>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            {...register('email')}
                            error={errors.email ? true : false}
                            helperText={errors.email ? errors.email.message : ''}
                        />
                        <ForgotPasswordButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                        >
                            Send Password Reset Email
                        </ForgotPasswordButton>
                    </FormContainer>
                </form>
                <RouterLink to="/login" style={{ textDecoration: 'none' }}>
                    <Link component="button" variant="body2">
                        Back to Login
                    </Link>
                </RouterLink>
            </ForgotPasswordPaper>
            {successAlert && (
                <Stack sx={{ width: "100%" }} spacing={2}>
                    <Alert variant="filled" severity="success">
                        Email sent successfully. Check your mail for the OTP
                    </Alert>
                </Stack>
            )}
        </Container>
    );
}
