import { create } from 'zustand';
import apiClient from '../../../services/client';
import {
    registerUser,
    loginUser,
    updateUser,
    getCurrentUser,
    resendVerificationEmail,
    refreshAccessToken,
    logoutUser,
    getFavorites,
    addFavorite,
    removeFavorite,
} from '../../../services/authService';

const extractErrorMessage = (err) =>
    err?.response?.data?.message || err?.message || 'Terjadi kesalahan';

const useAuthStore = create((set, get) => ({
    accessToken: null,
    user: null,
    isLoading: false,
    error: null,

    initialized: false,

    initializeAuth: async () => {
        if (get().initialized && get().user) return;

        // Check if user already exists from login
        const currentUser = get().user;
        // NEW: Check localStorage if not in Zustand
        let { accessToken } = get();
        if (!accessToken) {
            accessToken = localStorage.getItem('accessToken');
        }

        if (!accessToken) {
            set({ initialized: true });
            return;
        }

        // If user already exists from login, just mark as initialized (don't show spinner)
        if (currentUser) {
            set({ initialized: true });
            return;
        }

        // NEW: Add Authorization header manually
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        set({isLoading: true});
        try {
            const result = await getCurrentUser();
            const user = result;
            const normalizedUser = {
                ...user,
                isPremium: Boolean(user.is_premium),
                subscriptionPlan: user.subscription_plan || null,
            };
            set({user: normalizedUser, isLoading: false, initialized: true});
        } catch {
            set({isLoading: false, initialized: true})
        }
        
        // NEW: Clean up header
        delete apiClient.defaults.headers.common['Authorization'];
    },

    register: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            await registerUser(credentials);
            set({ user: null, isLoading: false });
            return true;
        } catch (err) {
            set({ error: extractErrorMessage(err), isLoading: false });
            return false;
        }
    },

    login: async (credentials) => {
        set({ isLoading: true, error: null, initialized: false });
        try {
            const result = await loginUser({
                username: credentials.username,
                password: credentials.password,
            });
            
            const { accessToken, user } = result;
            const normalizedUser = {
                ...user,
                isPremium: Boolean(user.is_premium),
                subscriptionPlan: user.subscription_plan || null,
            };

            set({ 
                accessToken, 
                user: normalizedUser, 
                isLoading: false 
            });
            localStorage.setItem('accessToken', accessToken);

            return true;
        } catch (err) {
            set({ error: extractErrorMessage(err), isLoading: false });
            return false;
        }
    },

    logout: async () => {
        try {
            await logoutUser();
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            set({ accessToken: null, user: null, error: null, initialized: false });
            localStorage.removeItem('accessToken');
        }
    },

    refreshToken: async () => {
        try {
            const result = await refreshAccessToken();
            const { accessToken } = result;
            
            set({ accessToken });
            return accessToken;
        } catch (err) {
            console.error('Refresh token failed:', err);
            set({ accessToken: null, user: null });
            throw err;
        }
    },

    fetchMe: async () => {
        set({ isLoading: true });

        try {
            const result = await getCurrentUser();
            const user = result;

            const normalizedUser = {
                ...user,
                isPremium: Boolean(user.is_premium),
                subscriptionPlan: user.subscription_plan || null,
                favorites: user.favorites || [],
            };

            set({ 
                user: normalizedUser, 
                isLoading: false 
            });
        } catch (err) {
            console.error('fetchMe failed:', err);
            set({ user: null, isLoading: false });
        }
    },

    updateProfile: async (updates) => {
        set({ isLoading: true, error: null });
        try {
            const currentUser = get().user;

            const payload = { ...currentUser, ...updates };
            if (payload.avatar) {
                payload.avatar_url = payload.avatar;
                delete payload.avatar;
            }

            const result = await updateUser(payload);
            const fresh = result;

            const normalizedUser = {
                ...fresh,
                isPremium: Boolean(fresh.is_premium),
                subscriptionPlan: fresh.subscription_plan || null,
                favorites: currentUser.favorites || [],
            };

            set({ user: normalizedUser, isLoading: false });
            return { success: true, message: 'Profile updated' };
        } catch (err) {
            const message = extractErrorMessage(err);
            set({ error: message, isLoading: false });
            return { success: false, message };
        }
    },

    resendVerification: async () => {
        set({ isLoading: true, error: null });
        try {
            const result = await resendVerificationEmail();
            set({ isLoading: false });
            return { success: true, message: result.message };
        } catch (err) {
            const message = extractErrorMessage(err);
            set({ error: message, isLoading: false });
            return { success: false, message };
        }
    },

    setPremium: async (planId = 'individual') => {
        const currentUser = get().user;
        if (!currentUser) return;

        const normalizedUser = {
            ...currentUser,
            isPremium: true,
            subscriptionPlan: planId,
        };
        
        set({ user: normalizedUser });

        try {
            await updateUser({ ...currentUser, subscription_status: true });
        } catch (error) {
            console.log('Gagal sync plan ke backend:', error);
        }
    },

    removePremium: () => {
        const currentUser = get().user;
        if (!currentUser) return;

        const updatedUser = {
            ...currentUser,
            isPremium: false,
            subscriptionPlan: null,
        };
        
        set({ user: updatedUser });
    },

    addToFavorites: async (contentId) => {
        try {
            await addFavorite(contentId);
            const result = await getFavorites();
            const currentUser = get().user;
            if (!currentUser) return false;
            
            set({ user: { ...currentUser, favorites: result.data || [] } });
            return true;
        } catch (err) {
            console.error('Add favorite failed:', err);
            return false;
        }
    },

    removeFromFavorites: async (contentId) => {
        try {
            await removeFavorite(contentId);
            const result = await getFavorites();
            const currentUser = get().user;
            if (!currentUser) return false;
            
            set({ user: { ...currentUser, favorites: result.data || [] } });
            return true;
        } catch (err) {
            console.error('Remove favorite failed:', err);
            return false;
        }
    },

    isFavorite: (contentId) => {
        const user = get().user;
        if (!user?.favorites) return false;
        return user.favorites.some(fav =>
            fav.content_id === contentId ||
            fav === contentId
        );
    },
}));

export default useAuthStore;