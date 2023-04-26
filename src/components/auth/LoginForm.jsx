import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { Container, Typography, TextField, Button, Paper, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/system";

const LoginPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));

const FormContainer = styled('div')(({ theme }) => ({
    width: '100%',
    marginTop: theme.spacing(1),
}));

const LoginButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(3, 0, 2),
}));

const SignUpLink = styled(Typography)(({ theme }) => ({
    textAlign: 'center',
    marginTop: theme.spacing(2),
}));

const formValidationSchema = z.object({
    username: z.string().nonempty('Name is required'),
    password: z.string().nonempty('Password is required'),
})


export default function LoginForm(props) {
    const [showPassword, setShowPassword] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(formValidationSchema)
    });

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    const handleFormSubmit = (data) => {
        const loginData = {
            username: data.username,
            password: data.password,
        };

        props.onAddLogin(loginData);
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
            }}
        >
            <LoginPaper>
                <Avatar sx={{ margin: 1, backgroundColor: theme.palette.primary.main }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Login
                </Typography>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <FormContainer>

                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            {...register('username')}
                            error={errors.username ? true : false}
                            helperText={errors.username ? errors.username.message : ''}
                        />

                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            id="password"
                            type={showPassword ? "text" : "password"}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            edge="end"
                                            aria-label="toggle password visibility"
                                            onClick={togglePasswordVisibility}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            autoComplete="current-password"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters',
                                },
                            })}
                            error={errors.password ? true : false}
                            helperText={errors.password ? errors.password.message : ''}
                        />

                        <LoginButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                        >
                            Login
                        </LoginButton>
                        <RouterLink to="/forgot-password" style={{ textDecoration: 'none' }}>
                            <Link
                                href="/forgot-password"
                                component="button"
                                variant="body2"
                            >

                                Forgot password?
                            </Link>
                        </RouterLink>
                    </FormContainer>
                </form>
                <SignUpLink component="div">
                    Don't have an account?{' '}
                    <Link href="/register" variant="body2">
                        Sign up
                    </Link>
                </SignUpLink>
            </LoginPaper>
        </Container>
    )
}
