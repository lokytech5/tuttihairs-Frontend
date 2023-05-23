import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { Container, CircularProgress, FormControl, Snackbar, Alert, FormLabel, FormControlLabel, RadioGroup, Radio, Typography, TextField, Button, Paper } from '@mui/material';
import { styled } from "@mui/system";
import { useTheme } from '@mui/material/styles';
import useOrder from '../../hooks/useOrder';
import useStore from '../../zustand/store'

const ShippingPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));

const FormContainer = styled('div')(({ theme }) => ({
    width: '100%',
    marginTop: theme.spacing(1),
}));

const ShippingButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(3, 0, 2),
}));

const formValidationSchema = z.object({
    address: z.string().nonempty('Address is required'),
    city: z.string().nonempty('City is required'),
    state: z.string().nonempty('State is required'),
    postalCode: z.string().nonempty('Postal code is required'),
    shippingMethod: z.string().nonempty('Shipping method is required'),
    phone: z.string().nonempty('Phone number is required'),
    name: z.string().nonempty('Name is required'),
})

export default function ShippingForm() {
    const theme = useTheme();
    // eslint-disable-next-line
    const { order, createOrder, loading, error } = useOrder();
    const cartItems = useStore((state) => state.cartItems);
    const userId = useStore((state) => state.userId);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors }, setValue,
    } = useForm({
        resolver: zodResolver(formValidationSchema),
        defaultValues: {
            shippingMethod: 'standard',
        }
    });

    const handleFormSubmit = async (data) => {
        setOpenSnackbar(false);
        const orderData = {
            user: userId,
            items: cartItems,
            shipping: {
                name: data.name,
                address: data.address,
                city: data.city,
                state: data.state,
                postalCode: data.postalCode,
                phone: data.phone,
                shippingMethod: data.shippingMethod,
            }
        };
        console.log(orderData)
       const result = await createOrder(orderData);
       if(result) {
           setOpenSnackbar(true);
       } else {

       }
    };

    const handleCloseSnackbar = (event, reason) => {
        if(reason === 'clickaway'){
            return;
        }
        setOpenSnackbar(false);
    }

    const handleRadioChange = (event) => {
        setValue('shippingMethod', event.target.value);
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
            <ShippingPaper>
              {loading && <CircularProgress/> }
              {error && <p>Error: {error}</p>}
                <Typography component="h1" variant="h5">
                    Shipping Information
                </Typography>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <FormContainer>

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
                            {...register('name')}
                            error={errors.name ? true : false}
                            helperText={errors.name ? errors.address.name.message : ''}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="address"
                            label="Address"
                            name="address"
                            autoComplete="address"
                            autoFocus
                            {...register('address')}
                            error={errors.address ? true : false}
                            helperText={errors.address ? errors.address.message : ''}
                        />

                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="city"
                            label="City"
                            name="city"
                            autoComplete="city"
                            {...register('city')}
                            error={errors.city ? true : false}
                            helperText={errors.city ? errors.city.message : ''}
                        />

                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="state"
                            label="State"
                            name="state"
                            autoComplete="state"
                            {...register('state')}
                            error={errors.state ? true : false}
                            helperText={errors.state ? errors.state.message : ''}
                        />

                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="postalCode"
                            label="Postal Code"
                            name="postalCode"
                            autoComplete="postal-code"
                            {...register('postalCode')}
                            error={errors.postalCode ? true : false}
                            helperText={errors.postalCode ? errors.postalCode.message : ''}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal" 
                            required
                            fullWidth
                            id="phone"
                            label="Phone Number"
                            name="phone"
                          autoComplete="tel"
                            {...register('phone')}
                            error={errors.phone ? true : false}
                            helperText={errors.phone ? errors.phone.message : ''}
                        />

                      <FormControl component="fieldset" margin="normal" required>
                          <FormLabel component="legend">Shipping Method</FormLabel>
                          <RadioGroup aria-label="shippingMethod"
                           name="shippingMethod"
                            onChange={handleRadioChange} 
                            row>
                              <FormControlLabel value="standard" control={<Radio />} label="Standard - #1000" />
                              <FormControlLabel value="express" control={<Radio />} label="Express - #2000" />
                          </RadioGroup>
                      </FormControl>

                        <ShippingButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={loading}
                        >
                            Confirm Shipping
                        </ShippingButton>
                    </FormContainer>
                </form>
            </ShippingPaper>

          <Snackbar
              open={openSnackbar}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
              <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                  Order submitted successfully!
              </Alert>
          </Snackbar>
        </Container>
    )
}
