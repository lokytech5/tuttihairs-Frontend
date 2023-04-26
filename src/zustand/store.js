import { create } from 'zustand'
import jwt_decode from 'jwt-decode';

const useStore = create((set, get) => ({
    isAuthenticated: false, // You'll update this value after the user logs in
    id: null,
    role: null, // 'user' or 'admin'
    token: null,
    username: null,

    setAuthenticated: (isAuth) => set({ isAuthenticated: isAuth }),

    login: (id, role, token, username) => set({
        isAuthenticated: true,
        id,
        role,
        token,
        username,
    }),

    logout: () => set({
        isAuthenticated: false,
        id: null,
        role: null,
        token: null,
        username: null,
    }),

    loadUser: (token) => {
        try {
            const decodedToken = jwt_decode(token);
            const { id, isAdmin, username } = decodedToken;

            const userRole = isAdmin ? 'admin' : 'user';

            set({
                id,
                role: userRole,
                token,
                username,
            });
        } catch (err) {
            console.error('Error loading user from token:', err);
        }
    },
}));


export default useStore
