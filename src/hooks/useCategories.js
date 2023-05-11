import { useState, useEffect } from 'react';
import axios from 'axios';

const useCategories = (page = 1) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/api/categorys?limit=4&page=${page}`);
                setCategories(response.data.categories);
                setTotalPages(response.data.totalPages);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchCategories();
    }, [page]);
    return { categories, loading, error, totalPages };
};

export default useCategories;
