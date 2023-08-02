import axios from 'axios';
import { useState, useCallback } from 'react'

export default function useOrder() {
    const [order, setOrder] = useState([]);
    const [error, setError] = useState('');
    const [completePurchase, setCompletePurchase] = useState(null);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token')

    const createOrder = async (shippingData) => {
        setLoading(true);

        try {
            const response = await axios.post(`http://localhost:5000/api/orders/`, shippingData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setOrder(response.data)
            setLoading(false);
            return response.data;
        } catch (error) {
            console.log(error.response.data);
            setError(error.message);
            setLoading(false);
        }
    }

    const fetchOrderById = useCallback(async (orderId) => {
        setLoading(true);
        const headers = {
            Authorization: `Bearer ${token}`
        };

        try {
            const response = await axios.get(`http://localhost:5000/api/orders/by/${orderId}`, {
                headers
            })
            if (response.data) {
                setOrder(response.data);
            } else {
                console.log(`Order with id: ${orderId} not found.`);
            }
            setLoading(false);
        } catch (error) {
            console.log(error.response.data);
            setError(error.message);
            setLoading(false);
        }

    }, []);

    const fetchOrdersByUserId = useCallback(async (userId) => {
        setLoading(true);
       
            try {
                const response = await axios.get(`http://localhost:5000/api/orders/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                setOrder(response.data.orders);
                setLoading(false);
                return response.data;
            } catch (error) {
                console.log(error.response.data);
                setError(error.message);
                setLoading(false);
            }
        
    }, []);


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

    return { order, createOrder, fetchOrderById, fetchOrdersByUserId, completePurchase, completePurchaseHandler, loading, error }

}
