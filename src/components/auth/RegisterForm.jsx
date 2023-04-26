import React from 'react'
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
import { useForm } from 'react-hook-form';
import { styled } from "@mui/system";


const useStyles = styled((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: theme.palette.background.default,
  },
  paper: {
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  link: {
    textAlign: 'center',
    marginTop: theme.spacing(2),
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  responsivePaper: {
    [theme.breakpoints.down('xs')]: {
      borderRadius: 0,
      minHeight: '100vh',
    },
  },
}));

export default function RegisterForm() {

  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
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
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Paper
        className={`${classes.paper} ${isMobile ? classes.responsivePaper : ''
          }`}
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <Avatar sx={{ margin: 1, backgroundColor: theme.palette.primary.main }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
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
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
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
            name="password"
            label="Password"
            type="password"
            id="password"
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

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirm-password"
            autoComplete="new-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Register
          </Button>
        </form>
        <Typography component="div" className={classes.link}>
          Already have an account?{' '}
          <Link href="/login" variant="body2">
            Sign in
          </Link>
        </Typography>
      </Paper>
    </Container>
  )
}
