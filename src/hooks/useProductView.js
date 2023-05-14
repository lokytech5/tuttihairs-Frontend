import { useState, useEffect } from 'react';
import axios from 'axios';

const useProductView = (productId) => {
    const [productViewDetails, setProductViewDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductViewDetails = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
                setProductViewDetails(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchProductViewDetails();
    }, [productId]);
    return { productViewDetails, loading, error };
};

export default useProductView;