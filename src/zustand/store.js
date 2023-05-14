import { create } from 'zustand'
import jwt_decode from 'jwt-decode';
import apiClient from '../api/apiClient';
import axios from 'axios';


const removeFromLocalStorage = (productId) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    console.log('Before removal:', cartItems);
    const updatedCartItems = cartItems.filter((item) => item._id !== productId);
    console.log('After removal:', updatedCartItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    return updatedCartItems;
};




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

    login: async (id, role, token, username) => {
        set({
            isAuthenticated: true,
            id,
            role,
            token,
            username,
        })
        // Sync local storage cart with the user's cart in the database
        await get().syncLocalStorageCart();
    },

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



    cartItems: [],
    cartSummary: { totalPrice: 0, totalItems: 0 },
    addToCart: async (product) => {
        const isAuthenticated = get().isAuthenticated;
        const userId = get().userId;
        const token = get().token;

        // Safeguard check to make sure cartItems is always an array
        if (!Array.isArray(get().cartItems)) {
            set({ cartItems: [] });
        }

        const itemIndex = get().cartItems.findIndex(item => item._id === product._id);

        if (itemIndex === -1) {
            set((state) => ({
                cartItems: [...state.cartItems, { ...product, quantity: 1 }],
            }));
        } else {
            set((state) => ({
                cartItems: state.cartItems.map((item, index) =>
                    index === itemIndex
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                ),
            }));
        }

        if (isAuthenticated) {
            // Call the API to add the product to the cart on the server for authenticated users
            try {
                await axios.post('http://localhost:5000/api/shoppingCart', { product: product._id, quantity: 1 }, {
                    headers: {
                        'Authorization': `Bearer ${get().token}`
                    }
                });
                // Update the cart items and cart summary
                get().fetchCartItems();
                get().fetchCartSummary();
            } catch (error) {
                console.error('Error adding item to cart:', error);
            }
        } else {
            // Store the cart data in local storage for unauthenticated users
            localStorage.setItem('cartItems', JSON.stringify(get().cartItems));
        }
        get().fetchCartSummary();

    },


    removeFromCart: async (productId) => {
        if (!productId) {
            console.error('Product ID is undefined');
            return;
        }
        console.log("Removing item with productId in store:", productId);
        const isAuthenticated = get().isAuthenticated;
        console.log('Is authenticated?', isAuthenticated);

        if (isAuthenticated) {
            // Call the API to remove the product from the cart on the server
            try {
                await axios.delete(`http://localhost:5000/api/shoppingCart/${productId}`, {
                    headers: {
                        'Authorization': `Bearer ${get().token}`
                    }
                });
                const updatedCartItems = get().cartItems.filter((item) => item.product_id !== productId);
                set({ cartItems: updatedCartItems });
            } catch (error) {
                console.error('Error removing item from cart:', error);
            }
        } else {
            // Update the cart data in local storage for unauthenticated users
            try {
                console.log('Removing from local storage for unauthenticated user');
                const updatedCartItems = removeFromLocalStorage(productId);
                set({ cartItems: updatedCartItems });
            } catch (error) {
                console.error('Error updating local storage for unauthenticated user:', error);
            }
        }
    },


    setCartItems: (items) => set({ cartItems: items }),

    fetchCartItems: async () => {
        if (get().isAuthenticated) {
            try {
                const response = await axios.get('http://localhost:5000/api/shoppingCart', {
                    headers: {
                        'Authorization': `Bearer ${get().token}`
                    }
                });
                get().setCartItems(response.data.items);
            } catch (error) {
                console.error('Failed to fetch cart items:', error);
                // Check if the error is a 404 error
                if (error.response && error.response.status !== 404) {
                    set({ cartItems: [] }); // Set cartItems to an empty array
                }

            }
        } else {
            // Load cart items from local storage for unauthenticated users
            const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            set({ cartItems });
        }
        console.log('Fetched cart items:', get().cartItems);
        console.log('Fetched cart summary:', get().cartSummary);
    },

    syncLocalStorageCart: () => new Promise(async (resolve, reject) => {
        try {
            const localStorageCart = JSON.parse(localStorage.getItem('cartItems')) || [];
            const currentCartItems = get().cartItems;

            // Merge localStorageCart and currentCartItems
            const mergedCart = [...localStorageCart, ...currentCartItems].reduce((acc, item) => {
                const existingItemIndex = acc.findIndex((cartItem) => cartItem._id === item._id);
                if (existingItemIndex !== -1) {
                    acc[existingItemIndex].quantity += item.quantity;
                } else {
                    acc.push(item);
                }
                return acc;
            }, []);

            set({ cartItems: mergedCart });
            localStorage.removeItem('cartItems');
            // Update the cart items on the server
            if (get().isAuthenticated) {
                console.log('Merged cart:', mergedCart);
                await axios.post('http://localhost:5000/api/shoppingCart/syncGuestCart', { guestCart: mergedCart }, {
                    headers: {
                        'Authorization': `Bearer ${get().token}`
                    }
                });
                await get().fetchCartItems();
                await get().fetchCartSummary();
            }
            resolve(); // Resolve the promise when the operation is complete
        } catch (error) {
            console.error('Error syncing cart items:', error);
            reject(error); // Reject the promise with the error
        }
    }),


    fetchCartSummary: async () => {
        if (get().isAuthenticated) {
            try {

                const response = await axios.get('http://localhost:5000/api/shoppingCart/summary', {
                    headers: {
                        'Authorization': `Bearer ${get().token}`
                    }
                });
                set({ cartSummary: response.data });

            } catch (error) {
                if (error.response && error.response.status !== 404) {
                    set({ cartSummary: { totalPrice: 0, totalItems: 0 } }); // Set cartSummary to an object with totalPrice and totalItems set to 0
                }
                console.error('Failed to fetch cart summary:', error);
            }
        } else {
            // Calculate cart summary for unauthenticated users using local storage
            const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
            const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

            set({ cartSummary: { totalPrice, totalItems } });
        }
    },


}));


export default useStore
