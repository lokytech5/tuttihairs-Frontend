import React, { useState } from "react";
import { Button, TextField, Typography, Container, IconButton, Avatar, InputAdornment, Link } from "@mui/material";
import { Box } from "@mui/system";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { styled } from "@mui/system";


const useStyles = styled({
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
    },
    form: {
        width: "100%",
        maxWidth: "400px",
    },
    formTitle: {
        marginBottom: "1.5rem",
    },
    submitBtn: {
        marginTop: "1.5rem",
    },
    togglePassword: {
        marginRight: "0.5rem",
    },
    switchComponent: {
        marginTop: "1rem",
    },
});

export default function LoginForm() {
    return (
        <div>LoginForm</div>
    )
}
