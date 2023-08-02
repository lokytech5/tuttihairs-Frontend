import axios from 'axios';
import { useState } from 'react'

export default function usePayment(endpoint) {
    const [payment, setPayment] = useState([]);
    const [verification, setVerification] = useState(null);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')


    const paymentGateWayHandler = async (paymentData) => {
        setLoading(true);
        try {
            const response = await axios.post(`http://localhost:5000/api/payments/${endpoint}/`, paymentData);
            setPayment(response.data);
            setLoading(false);
            return response.data;
        } catch (error) {
            console.error(`Error testing Paystack endpoint for ${endpoint}:`, error.message)
            setError(error.message);
            setLoading(false);
            return error.message;
        }

    }

    const verifyTransactionHandler = async (reference) => {
        setLoading(true);
        try {
            const response = await axios.post(`http://localhost:5000/api/payments/${endpoint}/verify`, { reference });
            setVerification(response.data);
            setLoading(false);
            return response.data;
        } catch (error) {
            console.error(`Error verifying Paystack transaction for ${endpoint}:`, error.message)
            setError(error.message);
            setLoading(false);
            return error.message;
        }
    }


    return {
        payment, verification,
        loading, error,
        paymentGateWayHandler, verifyTransactionHandler
    }

}
