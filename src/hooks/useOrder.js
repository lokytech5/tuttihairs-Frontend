import axios from 'axios';
import { useState } from 'react'
import useStore from '../zustand/store';

export default function useOrder() {
    const [order, setOrder] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const token = useStore((state) => state.token)

        const createOrder = async (shippingData) => {
            setLoading(true);
            try {
                const response = await axios.post(`http://localhost:5000/api/orders/`, shippingData, {
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                })
                    setOrder(response.data)
                    setLoading(false);
            } catch (error) {
                console.log(error.response.data);
                setError(error.message);
                setLoading(false);
            }
        }

        const fetchOrderById = async (orderId) => {
            setLoading(false);
            try {
                const response = await axios.get(`http://localhost:5000/api/orders/${orderId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setOrder(response.data);
                setLoading(false);       
            } catch (error) {
                console.log(error.response.data);
                setError(error.message);
                setLoading(false);
            }
        }

    return { order, createOrder, fetchOrderById, loading, error}
 
}
