import { create } from 'zustand'
import jwt_decode from 'jwt-decode';
import axios from 'axios';

const removeFromLocalStorage = (productId) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const updatedCartItems = cartItems.filter((item) => item.product._id !== productId);
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
    userEmail: null,
    avatarUrl: null,
    loading: true,

    setUserId: (userId) => set({ userId }),
    setUsername: (username) => set({ username }),
    setUserEmail: (email) => set({ userEmail: email }),
    setAuthenticated: (isAuth, avatarUrl) => set({ isAuthenticated: isAuth, avatarUrl: avatarUrl }),


    login: async (id, role, token, username) => {
        set({
            isAuthenticated: true,
            id,
            role,
            token,
            username,
        })

        localStorage.setItem('token', token);

        // Call these after updating the state with the new user details
        await get().fetchCartItems();
        await get().fetchCartSummary();
        // Sync local storage cart with the user's cart in the database
        await get().syncLocalStorageCart();
    },

    logout: () => {
        localStorage.removeItem('token');
        set({
            isAuthenticated: false,
            id: null,
            role: null,
            token: null,
            username: null,
            userEmail: null,
        });
    },

    loadToken: () => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwt_decode(token);
            const currentTime = Date.now().valueOf() / 1000;
            if (typeof decoded.exp !== "undefined" && decoded.exp < currentTime) {
                localStorage.removeItem('token');
                set({ token: null, isAuthenticated: false, loading: false });
            } else {
                set({ token, isAuthenticated: true, loading: false });
                get().loadUser(token);
                // Load cart items and summary after validating the token
                get().fetchCartItems();
                get().fetchCartSummary();
            }
        } else {
            set({ loading: false });
        }
    },

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

        } catch (err) {
            console.error('Error loading user from token:', err);
        }
    },

    cartItems: [],
    cartSummary: { totalPrice: 0, totalItems: 0 },
    addToCart: async (product, quantity = 1, color = 'black', inches = 32, length = '4x4', grams = '100') => {
        const isAuthenticated = get().isAuthenticated;

        // Safeguard check to make sure cartItems is always an array
        if (!Array.isArray(get().cartItems)) {
            set({ cartItems: [] });
        }

        const newCartItem = {
            product: product,
            product_name: product.name,
            description: product.description,
            price: product.price,
            image: product.image,
            color,
            inches,
            grams,
            length,
            quantity,
        };



        let productIndex = get().cartItems.findIndex(item =>
            item.product._id === newCartItem.product._id &&
            item.color === newCartItem.color &&
            item.inches === newCartItem.inches &&
            item.length === newCartItem.length &&
            item.grams === newCartItem.grams);
        if (productIndex !== -1) {
            // If product exists in the cart, increment the quantity
            set((state) => {
                let newCart = [...state.cartItems];
                newCart[productIndex].quantity += quantity;
                return { cartItems: newCart };
            });
        } else {
            // If product does not exist in the cart, add it with quantity of 1
            set((state) => ({
                cartItems: [...state.cartItems, newCartItem],
            }));
        }


        if (isAuthenticated) {
            // Call the API to add the product to the cart on the server for authenticated users
            try {

                const response = await axios.post('http://localhost:5000/api/shoppingCart', newCartItem, {
                    headers: {
                        'Authorization': `Bearer ${get().token}`
                    }
                });
                if (response.data.success) {
                    // Update the cart items and cart summary
                    get().fetchCartItems();
                    get().fetchCartSummary();
                }
            } catch (error) {
                console.error('Error adding item to cart:', error);
                if (error.response && error.response.data) {
                    console.log('Server response:', error.response.data);
                }
            }
        } else {
            // Store the cart data in local storage for unauthenticated users
            localStorage.setItem('cartItems', JSON.stringify(get().cartItems));
            // Ideally, you might also want to refresh the cart summary here for unauthenticated users, 
            // assuming fetchCartSummary() can work correctly for them.
            get().fetchCartSummary();
        }
        localStorage.setItem('cartItems', JSON.stringify(get().cartItems));
    },


    removeFromCart: async (productId) => {
        if (!productId) {
            return;
        }

        const isAuthenticated = get().isAuthenticated;

        if (isAuthenticated) {
            // For authenticated users
            // Call the API to remove the product from the cart on the server
            try {
                await axios.delete(`http://localhost:5000/api/shoppingCart/${productId}`, {
                    headers: {
                        'Authorization': `Bearer ${get().token}`
                    }
                });
                const updatedCartItems = get().cartItems.filter((item) => item.product._id !== productId);
                set({ cartItems: updatedCartItems });

                // Here is the update to local storage
                localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
            } catch (error) {
                console.error('Error removing item from cart:', error);
            }
        } else {
            // Update the cart data in local storage for unauthenticated users
            try {

                const updatedCartItems = removeFromLocalStorage(productId);

                set({ cartItems: updatedCartItems });
                localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
            } catch (error) {
                console.error('Error updating local storage for unauthenticated user:', error);
            }
        }
        get().fetchCartSummary();
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

                if (response.data.success) {
                    get().setCartItems(response.data.items);
                }
            } catch (error) {
                console.log('error in fetchCartItems function', error)
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
        // console.log('Fetched cart items:', get().cartItems);

    },

    syncLocalStorageCart: () => new Promise(async (resolve, reject) => {
        try {
            const localStorageCart = JSON.parse(localStorage.getItem('cartItems')) || [];
            const currentCartItems = get().cartItems;

            // Merge localStorageCart and currentCartItems
            const mergedCart = [...localStorageCart, ...currentCartItems].reduce((acc, item) => {
                const existingItemIndex = acc.findIndex((cartItem) => cartItem.product_id === item.product_id);
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

    clearCart: async () => {
        // Clear the cart items in the state
        set({ cartItems: [] });

        // Reset the cart summary
        set({ cartSummary: { totalPrice: 0, totalItems: 0 } });

        // Clear the local storage
        localStorage.removeItem('cartItems');
        console.log('Cleared local storage:', localStorage.getItem('cartItems')); 

        if (get().isAuthenticated) {
            // Call the API to clear the cart on the server for authenticated users
            try {
                await axios.delete('http://localhost:5000/api/shoppingCart/empty',{
                    headers: {
                        'Authorization': `Bearer ${get().token}`
                    }
                });
                console.log('State after clearing:', get().cartItems, get().cartSummary); 
            } catch (error) {
                console.error('Error clearing cart:', error);
            }
        }
    },


}));


export default useStore
