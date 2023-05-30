import React, { useEffect, useState } from 'react'
import axios from 'axios';

export default function useService(page = 1) {
    const [service, setService] = useState({ services: [] })
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [servicePages, setServicePages] = useState(1);


    useEffect(() => {
        const fetchServices = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/api/services?limit=2&page=${page}/`)
                setService(response.data);
                setServicePages(response.data.totalPages)
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchServices();
    }, [page]);
    return { service, servicePages, loading, error }
}


