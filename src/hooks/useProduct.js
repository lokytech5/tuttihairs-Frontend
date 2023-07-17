import { useState, useEffect } from 'react';
import axios from 'axios';

const useProduct = (page = 1, categoryId, search = '') => {
    const [productList, setProductList] = useState([]);
    const [categoryProductList, setCategoryProductList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [categories, setCategories] = useState([]);
    const [categoryTotalPages, setCategoryTotalPages] = useState(1);
    const [categoryPage, setCategoryPage] = useState(1);

    useEffect(() => {
        const fetchProductList = async () => {
            setLoading(true);
            try {
                let url = `http://localhost:5000/api/products?limit=5&page=${page}&search=${search}`;
                const response = await axios.get(url);
                setProductList(response.data.product);
                setTotalPages(response.data.totalPages);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchProductList();
    }, [page, search]);


    useEffect(() => {
        if (categoryId) {
            const fetchCategoryProductList = async () => {
                setLoading(true);
                try {
                    let url = `http://localhost:5000/api/products/category/${categoryId}?limit=5&page=${categoryPage}`;
                    const response = await axios.get(url);
                    setCategoryProductList(response.data.products);
                    setCategoryTotalPages(response.data.totalPages);
                    setLoading(false);
                } catch (error) {
                    setError(error.message);
                    setLoading(false);
                }
            };
            fetchCategoryProductList();
        } else {
            setCategoryProductList([]);
            setCategoryTotalPages(1);
        }
    }, [categoryId, categoryPage]);


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/categorys/all`);
                setCategories(response.data.categories);
            } catch (error) {
                setError(error.message);
            }
        };
        fetchCategories();
    }, []);

    return {
        productList,
        categoryProductList,
        loading,
        error,
        totalPages,
        categories,
        categoryTotalPages,
        setCategoryPage
    };
}

export default useProduct;