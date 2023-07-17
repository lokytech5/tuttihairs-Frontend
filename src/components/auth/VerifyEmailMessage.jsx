import React from "react";
import {
    Container,
    Typography,
    Paper,
    Avatar,
    useTheme,
    Link,
} from "@mui/material";
import { styled } from "@mui/system";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import EmailIcon from '@mui/icons-material/Email';

const EmailSentPaper = styled(Paper)(({ theme }) => ({
    marginTop: theme.spacing(8),
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
}));

export default function VerifyEmailMessage() {
    const theme = useTheme();

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
            <EmailSentPaper>
                <Avatar
                    sx={{ margin: 1, backgroundColor: theme.palette.primary.main }}
                >
                    <EmailIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Verification Email Sent
                </Typography>
                <Typography variant="body1" align="center">
                    Thanks for registering! A verification email has been sent to your email address. Please check your inbox and click the verification link to complete your registration.
                </Typography>
                <Link component={RouterLink} to="/login" variant="body2" align="center">
                    Back to Login
                </Link>
            </EmailSentPaper>
        </Container>
    )
}
