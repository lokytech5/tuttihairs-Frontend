import { create } from 'zustand'

const useUserStore = create((set) => ({
    userData: null,
    isLoading: true,
    setUserData: (data) => set({ userData: data }),
    setIsLoading: (loading) => set({ isLoading: loading }),
}));

export default useUserStore;