import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Avatar,
} from '@mui/material';
import { styled } from "@mui/system";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import useStore from '../../zustand/store'

const UserProfileContainer = styled(Container)(({ theme }) => ({
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
}));

const UserProfilePaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: theme.spacing(1),
}));

const AvatarContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
}));

const UserProfileAvatar = styled(Avatar)(({ theme }) => ({
    width: theme.spacing(10),
    height: theme.spacing(10),
    marginBottom: theme.spacing(1),
}));

// const UserProfilePaper = styled(Paper)(({ theme }) => ({
//     padding: theme.spacing(2),
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
// }));

const FormContainer = styled('div')(({ theme }) => ({
    width: '100%',
    marginTop: theme.spacing(1),
}));

const UpdateButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(3, 0, 2),
}));

const formValidationSchema = z.object({
    firstName: z.string().nonempty('FirstName is required').optional(),
    lastName: z.string().nonempty('LastName is required').optional(),
    phone: z.string().nonempty('Phone is required').optional(),
})


export default function UserProfile(props) {
    const { localAvatarUrl } = props;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(formValidationSchema)
    });
    const [avatar, setAvatar] = useState(null);

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setProfile({ ...profile, [name]: value });
    // };

    const handleAvatarChange = (e) => {
        if (!e.target.files[0]) {
            alert('Please select an image file to upload');
            return;
        }
        console.log('Selected avatar file:', e.target.files[0]);
        setAvatar(e.target.files[0]);
    };

    const handleFormSubmit = (data) => {
        // Implement your logic for updating the user profile and avatar
        // using the provided endpoint and model. 
        const updateData = {
            profile: {
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
            },
        }

        props.onAddUpdate(updateData)
        props.onAddAvatar(avatar);
    };

    return (
        <UserProfileContainer
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
            <UserProfilePaper>
                <Typography component="h1" variant="h5">
                    Update Profile
                </Typography>
                <AvatarContainer>
                    <UserProfileAvatar
                        src={avatar ? URL.createObjectURL(avatar) : localAvatarUrl}
                    />
                    <input
                        accept="image/*"
                        id="contained-button-file"
                        multiple
                        type="file"
                        onChange={handleAvatarChange}
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="contained-button-file">
                        <Button variant="contained" color="primary" component="span">
                            Upload Avatar
                        </Button>
                    </label>
                </AvatarContainer>

                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <FormContainer>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="firstName"
                            label="First Name"
                            name="firstName"
                            autoComplete="given-name"
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
                            label="Last Name"
                            name="lastName"
                            autoComplete="family-name"
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
                            autoComplete="tel"
                            {...register('phone')}
                            error={errors.phone ? true : false}
                            helperText={errors.phone ? errors.phone.message : ''}
                        />

                        <UpdateButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                        >
                            Update Profile
                        </UpdateButton>
                    </FormContainer>
                </form>
            </UserProfilePaper>
        </UserProfileContainer>
    );
}
