import { create } from 'zustand'
import jwt_decode from 'jwt-decode';

const useStore = create((set, get) => ({
    isAuthenticated: false, // You'll update this value after the user logs in
    id: null,
    userId: null,
    role: null, // 'user' or 'admin'
    token: null,
    username: null,
    avatarUrl: null,

    setUserId: (userId) => set({ userId }),
    setUsername: (username) => set({ username }),
    setAuthenticated: (isAuth, avatarUrl) => set({ isAuthenticated: isAuth, avatarUrl: avatarUrl }),

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

    setAvatarURL: (url) => set({ avatarUrl: url }),

    loadUser: (token) => {
        try {
            const decodedToken = jwt_decode(token);
            const { _id, isAdmin, username, avatar } = decodedToken;

            const userRole = isAdmin ? 'admin' : 'user';

            set({
                userId: _id,
                role: userRole,
                token,
                username,
                avatarUrl: avatar,
            });
            console.log('Updated store:', get());
        } catch (err) {
            console.error('Error loading user from token:', err);
        }
    },
}));


export default useStore
