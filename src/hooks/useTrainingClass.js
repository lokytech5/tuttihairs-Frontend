import { useEffect, useState } from 'react'
import axios from 'axios';
import useStore from '../zustand/store';
export default function useTrainingClass() {
    const [trainingClass, setTrainingClass] = useState({ trainingClasses: [] });
    const [verifiyPhoneNumber, setVerifiyPhoneNumber] = useState({})
    const [trainingClassId, setTrainingClassId] = useState('')
    const [registeredTrainingClassData, setRegisteredTrainingClassData] = useState({})
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const phoneNumber = useStore((state) => state.phoneNumber);
    const token = useStore((state) => state.token);
    const setTrainingClassOrder = useStore((state) => state.setTrainingClassOrder);
    const trainingClassOrder = useStore((state) => state.trainingClassOrder);


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
        console.log('fetching training class order, id:', orderId);
        try {
            const response = await axios.get(`http://localhost:5000/api/trainingClassOrders/${orderId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            console.log("Order Response:", response.data);
            setTrainingClassOrder(response.data);
            console.log('Order set in state:', response.data);
            setLoading(false);
        } catch (error) {
            console.log('Error fetching order:', error.message);
            setError(error.message);
            setLoading(false);
        }
    }

    const fetchRegisteredTrainingClass = async (registeredData, trainingClassId) => {
        setLoading(true);
        console.log('Registering training class, id:', trainingClassId);
        try {
            const response = await axios.post(`http://localhost:5000/api/trainingClasses/${trainingClassId}/register`, registeredData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            console.log('Registration response:', response.data);
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



    return {
        trainingClass, fetchTrainingClassOrder,
        trainingClassOrder, registeredTrainingClassData,
        fetchVerifyPhoneNumber, fetchRegisteredTrainingClass,
        loading, error
    };
}
