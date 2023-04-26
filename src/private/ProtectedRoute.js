import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import useStore from '../zustand/store'

export default function ProtectedRoute({ requiredRole }) {
    const isAuthenticated = useStore((state) => state.isAuthenticated);
    const userRole = useStore((state) => state.role);

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (requiredRole && !requiredRole.includes(userRole)) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
}
