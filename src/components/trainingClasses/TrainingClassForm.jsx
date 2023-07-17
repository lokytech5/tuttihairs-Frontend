import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Avatar,
    Button,
    TextField,
    Paper,
    Container,
    CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import { styled } from "@mui/system";
import useTrainingClass from '../../hooks/useTrainingClass';
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


const FormContainer = styled('div')(({ theme }) => ({
    width: '100%',
    marginTop: theme.spacing(4),
}));

const RegisterButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(3, 0, 2),
}));

const formValidationSchema = z.object({
    firstName: z.string().nonempty('FirstName is required').optional(),
    lastName: z.string().nonempty('LastName is required').optional(),
    phone: z.string().nonempty('Phone is required').optional(),
})
export default function TrainingClassForm() {
    const navigate = useNavigate();
    const theme = useTheme();
    const { fetchRegisteredTrainingClass, loading } = useTrainingClass();
    const trainingClassId = useStore((state) => state.trainingClassId)
    const setPhoneNumber = useStore(state => state.setPhoneNumber);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(formValidationSchema)
    });


    const handleFormSubmit = async (data) => {

        const trainingClassData = {
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
        }
        setPhoneNumber(data.phone);
        const response = await fetchRegisteredTrainingClass(trainingClassData, trainingClassId)
        if (response.error) {
            console.log(response.error)
        } else {
            if (response.isPhoneVerified) {
                navigate('/trainingConfirmation')
            } else {
                navigate('/verifiyPhone')
            }
        }
    }

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
                    <ClassOutlinedIcon />
                </StyledAvatar>
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
                            id="phone"
                            label="Phone Number"
                            name="phone"
                            autoComplete="phone"
                            autoFocus
                            {...register('phone')}
                            error={errors.phone ? true : false}
                            helperText={errors.phone ? errors.phone.message : ''}
                        />

                        <RegisterButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Register'}
                        </RegisterButton>
                    </FormContainer>
                </form>
            </StyledPaper>
        </Container>
    )
}
