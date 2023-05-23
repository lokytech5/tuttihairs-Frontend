import { useState, useEffect } from 'react';
import axios from 'axios';
import useStore from '../zustand/store';

const useProductView = (productId) => {
    const [productViewDetails, setProductViewDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [reviewLoading, setReviewLoading] = useState(false);
    const token = useStore((state) => state.token)

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

    const addProductReview = async (reviewData) => {
        setReviewLoading(true);
        try {
            const response = await axios.post(`http://localhost:5000/api/products/${productId}/review`, reviewData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if(response.status === 200){
                setProductViewDetails(prevState => ({
                    ...prevState,
                    reviews: [...prevState.reviews, response.data]
                }));
            }
            setReviewLoading(false);
        } catch (error) {
            setError(error.message);
            setReviewLoading(false);
        }
    }


    const deleteProductReview = async (reviewId) => {
        setLoading(true);
        try {
           const response = await axios.delete(`http://localhost:5000/api/products/${productId}/review/${reviewId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if(response.status === 200){
                setProductViewDetails(prevState => ({
                    ...prevState,
                    reviews: prevState.reviews.filter(review => review._id !== reviewId)
                }));
            }
            setLoading(false);
        } catch (error) {
            if(error.response.status === 404) {
                setError(error.message);
            }
            setLoading(false);
        }
    }

    return { productViewDetails, setProductViewDetails, loading, reviewLoading, setError, error, addProductReview, deleteProductReview };
};

export default useProductView;