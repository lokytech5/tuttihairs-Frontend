import { useEffect, useState } from 'react'
import axios from 'axios';
import useStore from '../zustand/store';
export default function useTrainingClass() {
    const [trainingClass, setTrainingClass] = useState({ trainingClasses: [] });
    const [verifiyPhoneNumber, setVerifiyPhoneNumber] = useState({})
    const [trainingClassPayment, setTrainingClassPayment] = useState({})
    const trainingClassId = useStore((state) => state.trainingClassId)
    const [registeredTrainingClassData, setRegisteredTrainingClassData] = useState({})
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const phoneNumber = useStore((state) => state.phoneNumber);
    const token = useStore((state) => state.token);
    const setTrainingClassOrder = useStore((state) => state.setTrainingClassOrder);
    const trainingClassOrder = useStore((state) => state.trainingClassOrder);
    const userId = useStore(state => state.userId);

    useEffect(() => {
        const fetchTrainingClass = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/api/trainingClasses/`)
                setTrainingClass(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchTrainingClass();
    }, []);

    useEffect(() => {
        if (!trainingClassId) {
            return;
        }
    }, [trainingClassId]);

    const fetchTrainingClassOrder = async (orderId) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/trainingClassOrders/${orderId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            setTrainingClassOrder(response.data);
            setLoading(false);
        } catch (error) {
            console.log('Error fetching order:', error.message);
            setError(error.message);
            setLoading(false);
        }
    }

    const fetchRegisteredTrainingClass = async (registeredData, trainingClassId) => {
        setLoading(true);
        try {
            const response = await axios.post(`http://localhost:5000/api/trainingClasses/${trainingClassId}/register`, registeredData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            setRegisteredTrainingClassData(response.data);
            await fetchTrainingClassOrder(response.data.orderId);
            setLoading(false);
            return response.data;
        } catch (error) {
            console.log('Error registering class:', error.message);
            setError(error.message);
            setLoading(false);
            return { error: error.message };
        }
    }

    const fetchVerifyPhoneNumber = async (code) => {
        const phoneData = {
            phone: phoneNumber,
            code
        }

        try {
            const response = await axios.post(`http://localhost:5000/api/trainingClasses/verify-phone`, phoneData)
            setVerifiyPhoneNumber(response.data);
            setLoading(false);
            return response.data;
        } catch (error) {
            setError(error.message);
            setLoading(false);
            return false;
        }
    }

    const completeTrainingClassPaymentHandler = async() => {
        setLoading(true);
        try {
            const response = await axios.put(`http://localhost:5000/api/trainingClasses/${trainingClassId}/updatePaymentStatus/${userId}`)
            setTrainingClassPayment(response.data);
            setLoading(false);
            return response.data;
        } catch (error) {
            console.error('Error verifying Paystack transaction:', error.message)
            setError(error.message);
            setLoading(false);
            return error.message; 
        }
    }

    return {
        trainingClass, fetchTrainingClassOrder, completeTrainingClassPaymentHandler,
        trainingClassOrder, registeredTrainingClassData,
        fetchVerifyPhoneNumber, fetchRegisteredTrainingClass,
        loading, error
    };
}



// useEffect(() => {
    //         await axios.put(`http://localhost:5000/api/trainingClasses/${trainingClassId}/updatePaymentStatus/${userId}`)
    //                                    .then((response) => {
    //                                     setTrainingClassPayment(response.data)
    //                                    })
    //                                    .catch((err) => {
    //                                        setError(err.message)
    //                                    })
    //     }
    // }, [])
