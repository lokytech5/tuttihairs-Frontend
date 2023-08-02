import React, { useContext } from "react";
import useService from "../../hooks/useService";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import useStore from "../../zustand/store";
import ServicePriceContext, { ServicePriceProvider } from "../context/ServicePriceContext";
import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, CircularProgress, Alert, Box, Card, CardContent, Typography, Pagination, Button } from "@mui/material";
export default function TrainingService() {
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    const { servicePrices, setServicePrices } = useContext(ServicePriceContext)
    const { service, loading, error, servicePages } = useService(page);
    const toggleServiceSelection = useStore(state => state.toggleServiceSelection);

    // State for managing the modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [calculatedServices, setCalculatedServices] = useState([]);

    // Update serviceButtonHandler to open the modal
    const serviceButtonHandler = (service) => {
        setCalculatedServices(prevServices => [...prevServices, service]);
        setSelectedService(service);
        setIsModalOpen(true);
    }


    const handlePageChange = (event, value) => {
        setPage(value);
    };

    if (loading) {
        return <CircularProgress />
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    function ServiceCard({ service }) {
        return (
            <>


                <Card sx={{ maxWidth: 185, marginRight: 2, marginLeft: 2 }}>
                    <CardContent
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant="body1" color="text.secondary"
                            style={{
                                overflow: 'hidden',
                                display: '-webkit-box',
                                textAlign: 'center',
                                WebkitLineClamp: 1 ? 'none' : 3,
                                WebkitBoxOrient: 'vertical',
                            }} >
                            {service.serviceName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" marginTop={1} marginBottom={1}>
                            {service.description}
                        </Typography>
                        <Typography variant="body2" marginBottom={1}>
                            {`Price: ${service.price}`}
                        </Typography>
                        <Button sx={{ textAlign: "center" }} color="primary" onClick={() => serviceButtonHandler(service)}>
                            <AddCircleIcon />
                        </Button>
                    </CardContent>
                </Card>

                <Dialog
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                >
                    <DialogTitle>Confirm Service Selection</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to select the service {selectedService?.serviceName} with the price of {selectedService?.price}?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => {
                            toggleServiceSelection(selectedService);
                            setServicePrices(prevServices => [...prevServices, selectedService.price]);
                            setIsModalOpen(false);
                        }}>
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
            </>

        );
    }

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column", // changed from row to column
                    overflowX: "auto",
                    marginBottom: 2,
                    marginTop: 2
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row", // row for the cards
                        overflowX: "auto"
                    }}
                >
                    {service.services.map((s) => (
                        <ServiceCard key={s._id} service={s} />
                    ))}
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 1
                    }}
                >
                    <Pagination
                        count={servicePages}
                        page={page}
                        onChange={handlePageChange}
                    />
                </Box>
            </Box>
        </>
    );
}