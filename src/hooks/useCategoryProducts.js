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
                const response = await axios.get(`http://localhost:5000/api/products/category/no-limit/${categoryId}`);
                setProducts(response.data);
                // console.log("Fetched products:", response.data);
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

    const updateProductStock = async (productId, newStock) => {
        try {
            await axios.put(`http://localhost:5000/api/products/${productId}`, {
                stock: newStock,
            });
            const updatedProducts = products.map((product) => {
                if (product._id === productId) {
                    return { ...product, stock: newStock };
                }
                return product;
            });
            setProducts(updatedProducts);
        } catch (error) {
            setError(error);
        }

    }

    return { products, loading, error, updateProductStock };
};

export default useCategoryProducts;
