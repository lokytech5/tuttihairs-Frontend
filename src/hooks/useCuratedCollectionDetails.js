import { useState, useEffect } from 'react'
import axios from 'axios'

const useCuratedCollectionDetails = (collectionId) => {
    const [curatedCollectionDetails, setCuratedCollectionDetails] = useState(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCuratedCollectionDetails = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/api/curatedCollection/${collectionId}`)
                setCuratedCollectionDetails(response.data.collection)
                setLoading(false);
                
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchCuratedCollectionDetails();
    }, [collectionId]);

    return { curatedCollectionDetails, loading, error}
};

export default useCuratedCollectionDetails;