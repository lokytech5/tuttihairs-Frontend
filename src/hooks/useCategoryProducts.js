// hooks/useCategoryProducts.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useCategoryProducts = (categoryId) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/api/products/category/${categoryId}`);
                setProducts(response.data);
                console.log("Fetched products:", response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        if (categoryId) {
            fetchProducts();
        }
    }, [categoryId]);

    return { products, loading, error };
};

export default useCategoryProducts;
