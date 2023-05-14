import { useState, useEffect } from "react";
import axios from "axios";

const useCategoryDetails = (productId) => {
    const [categoryDetails, setCategoryDetails] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)


    useEffect(() => {
        const fetchuseProductDetails = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/api/products/${productId}`)
                setCategoryDetails(response.data)
                setLoading(false)
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchuseProductDetails();
    }, [productId]);

    return { categoryDetails, loading, error }
}

export default useCategoryDetails;