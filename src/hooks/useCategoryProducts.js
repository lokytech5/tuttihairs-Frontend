import { useState, useEffect } from 'react';
import axios from 'axios';

const useCategoryProducts = (categoryId) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoryPage, setCategoryPage] = useState(1);
    const [categoryTotalPages, setCategoryTotalPages] = useState(1);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/api/products/category/${categoryId}?limit=4&page=${categoryPage}`);
                setProducts(response.data.products);
                setCategoryTotalPages(response.data.totalPages)
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
    }, [categoryId, categoryPage]);

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

    return { products, loading, error, updateProductStock, categoryTotalPages, setCategoryPage, categoryPage };
};

export default useCategoryProducts;
