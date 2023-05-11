import { useState, useEffect } from 'react'
import axios from 'axios'

const useCuratedCollection = () => {
    const [curatedCollection, setCuratedCollection] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchCuratedCollection = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/api/curatedCollection/`)
                setCuratedCollection(response.data.collections);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchCuratedCollection();
    }, []);
    return { curatedCollection, loading, error };
};

export default useCuratedCollection;