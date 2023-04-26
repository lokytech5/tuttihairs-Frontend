import React from 'react'
import { Link as RouterLink } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Avatar,
  Button,
  TextField,
  Paper,
  Typography,
  Container,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Link from '@mui/material/Link';
import { styled } from "@mui/system";


const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  margin: theme.spacing(1),
  backgroundColor: theme.palette.primary.main,
}));

const StyledTypography = styled(Typography)({
  textAlign: "center",
  marginTop: "theme.spacing(2)",
});


const FormContainer = styled('div')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(1),
}));

const RegisterButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}));

const formValidationSchema = z.object({
  username: z.string().nonempty('Name is required'),
  email: z.string().nonempty('Email is required'),
  password: z.string().nonempty('Password is required'),
})

export default function RegisterForm(props) {


  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(formValidationSchema)
  });

  const handleFormSubmit = (data) => {
    const registerData = {
      username: data.username,
      email: data.email,
      password: data.password,
    };

    props.onAddRegister(registerData);
  };

  const password = watch('password', '');

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
      <StyledPaper>
        <StyledAvatar>
          <LockOutlinedIcon />
        </StyledAvatar>
        <StyledTypography component="h1" variant="h5">
          Register
        </StyledTypography>
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
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              {...register('email', {
                required: true,
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address',
                },
              })}
              error={errors.email ? true : false}
              helperText={errors.email ? errors.email.message : ''}
            />


            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="password"
              type="password"
              label="Password"
              name="password"
              autoComplete="password"
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


            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="confirmPassword"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              {...register('confirmPassword', {
                required: 'Confirm password is required',
                validate: (value) =>
                  value === password || 'Passwords must match',
              })}
              error={errors.confirmPassword ? true : false}
              helperText={
                errors.confirmPassword ? errors.confirmPassword.message : ''
              }
            />
            <RegisterButton
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              Register
            </RegisterButton>
          </FormContainer>
        </form>
        <StyledTypography>
          Already have an account?&nbsp;
          <Link component={RouterLink} to="/login" variant="body2">
            Sign in
          </Link>
        </StyledTypography>
      </StyledPaper>
    </Container>
  )
}
