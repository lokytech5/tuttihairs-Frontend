import React, { useEffect, useState } from 'react'
import axios from 'axios';
export default function useTrainingClass() {
    const [trainingClass, setTrainingClass] = useState({ trainingClasses: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

    return { trainingClass, loading, error };
}
