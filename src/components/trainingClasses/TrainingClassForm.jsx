import React, {  useMemo, useState } from 'react'
import { Link as RouterLink, useLocation, } from "react-router-dom";
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
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import { styled } from "@mui/system";
import TrainingService from './TrainingService';
import { ServicePriceProvider } from "../context/ServicePriceContext";
import useStore from '../../zustand/store';


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
  marginTop: theme.spacing(4),
}));

const RegisterButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}));

const formValidationSchema = z.object({
  username: z.string().nonempty('Name is required'),
  password: z.string().nonempty('Password is required'),
  confirmPassword: z.string().nonempty('Confirmed Password is required'),
  email: z.string().nonempty('Email is required'),
  firstName: z.string().nonempty('FirstName is required').optional(),
  lastName: z.string().nonempty('LastName is required').optional(),
  phone: z.string().nonempty('Phone is required').optional(),
})
export default function TrainingClassForm() {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const location = useLocation();
  const classPrice = location.state?.classPrice;
  const [servicePrices, setServicePrices] = useState([]);
  const theme = useTheme();

 const totalPrice = useMemo(() => {
  return classPrice + (servicePrices.reduce((a,b) => a + b, 0) || 0);
 }, [classPrice, servicePrices])

  const {
    register,
    handleSubmit,
    getValues, setError,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(formValidationSchema)
  });

  //*Validating Password
  const validatePassword = () => {
    if (getValues('password') !== getValues('confirmPassword')) {
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
    const privateTrainingData = {
      username: data.username,
      password: data.password,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
    }
  }

  const password = watch('password', '');

  return (
  
      <ServicePriceProvider value={{ servicePrices, setServicePrices }}>
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
        <StyledTypography component="h1" variant="h5" marginTop={1}>
          Add Value to Your Class with Our Services
        </StyledTypography>
        <TrainingService />

        <StyledPaper>
          <StyledAvatar>
            <ClassOutlinedIcon />
          </StyledAvatar>
          <StyledTypography component="h1" variant="h5">
            Total price #{totalPrice}
          </StyledTypography>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <FormContainer>

              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="firstName"
                label="first Name"
                name="firstName"
                autoComplete="firstName"
                autoFocus
                {...register('firstName')}
                error={errors.firstName ? true : false}
                helperText={errors.firstName ? errors.firstName.message : ''}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="lastName"
                label="last Name"
                name="lastName"
                autoComplete="lastName"
                autoFocus
                {...register('lastName')}
                error={errors.lastName ? true : false}
                helperText={errors.lastName ? errors.lastName.message : ''}
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
                id="phone"
                label="Phone Number"
                name="phone"
                autoComplete="phone"
                autoFocus
                {...register('phone')}
                error={errors.phone ? true : false}
                helperText={errors.phone ? errors.phone.message : ''}
              />

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
        </StyledPaper>
      </Container>
      </ServicePriceProvider>
  )
}