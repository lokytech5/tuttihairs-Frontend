import React, { useMemo, useState } from 'react'
import { Link as RouterLink, useLocation, useNavigate, } from "react-router-dom";
import {
  Avatar,
  Button,
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

export default function TrainingClassPriceConfirmation() {
  const navigate = useNavigate();
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const location = useLocation();
  const classPrice = location.state?.classPrice;
  const [servicePrices, setServicePrices] = useState([]);
  const theme = useTheme();

  const totalPrice = useMemo(() => {
    return classPrice + (servicePrices.reduce((a, b) => a + b, 0) || 0);
  }, [classPrice, servicePrices])


  const handleFormSubmit = (event) => {
    event.preventDefault();
    navigate('/trainingRegisterForm')
  }

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
          <form onSubmit={(handleFormSubmit)}>
            <FormContainer>

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