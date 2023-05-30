import axios from 'axios';
import React, { useState } from 'react'

export default function usePayment() {
    const [payment, setPayment] = useState([]);
    const [verification, setVerification] = useState(null);
    const [completePurchase, setCompletePurchase] = useState(null);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const token = localStorage.getItem('token');

    const paymentGateWayHandler = async (paymentData) => {
        setLoading(true);
        try {
            const response = await axios.post(`http://localhost:5000/api/payments/ecommerce/`, paymentData);
            setPayment(response.data);
            setLoading(false);
            return response.data;
        } catch (error) {
            console.error('Error testing Paystack endpoint:', error.message)
            setError(error.message);
            setLoading(false);
            return error.message;
        }

    }

    const verifyTransactionHandler = async (reference) => {
        setLoading(true);
        try {
            const response = await axios.post(`http://localhost:5000/api/payments/ecommerce/verify`, { reference });
            setVerification(response.data);
            setLoading(false);
            return response.data;
        } catch (error) {
            console.error('Error verifying Paystack transaction:', error.message)
            setError(error.message);
            setLoading(false);
            return error.message;
        }
    }

    const completePurchaseHandler = async (orderId) => {
        setLoading(true);
        try {
            const response = await axios.put(`http://localhost:5000/api/orders/${orderId}`, { status: 'Processing' }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCompletePurchase(response.data);
            setLoading(false);
            return response.data;
        } catch (error) {
            console.error('Error verifying Paystack transaction:', error.message)
            setError(error.message);
            setLoading(false);
            return error.message;
        }
    }
    

return { payment, verification, 
         loading, error, 
         paymentGateWayHandler, verifyTransactionHandler,
         completePurchase, completePurchaseHandler }

}
