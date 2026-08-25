import { create } from 'zustand';
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
        set({ isLoading: true, error: null });
        try {
            const result = await loginUser({
                username: credentials.username,
                password: credentials.password,
            });
            
            const { accessToken, user } = result.data;

            const normalizedUser = {
                ...user,
                isPremium: Boolean(user.is_premium),
                subscriptionPlan: user.subscription_plan || null,
            };

            let favorites = [];
            try {
                const favResult = await getFavorites();
                favorites = favResult.data || [];
            } catch (e) {
                console.error('Failed to fetch favorites:', e);
            }

            set({ 
                accessToken, 
                user: { ...normalizedUser, favorites }, 
                isLoading: false 
            });
            
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
            set({ accessToken: null, user: null, error: null });
        }
    },

    refreshToken: async () => {
        try {
            const result = await refreshAccessToken();
            const { accessToken } = result.data;
            
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
            const { user, accessToken } = result.data;

            const normalizedUser = {
                ...user,
                isPremium: Boolean(user.is_premium),
                subscriptionPlan: user.subscription_plan || null,
            };

            set({ 
                accessToken: accessToken || get().accessToken,
                user: normalizedUser, 
                isLoading: false 
            });
        } catch (err) {
            console.error('fetchMe failed:', err);
            set({ accessToken: null, user: null, isLoading: false });
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
            const fresh = result.data;

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
            const currentUser = get().user;
            if (!currentUser) return false;
            
            const newFavorites = [...(currentUser.favorites || []), contentId];
            set({ user: { ...currentUser, favorites: newFavorites } });
            return true;
        } catch (err) {
            console.error('Add favorite failed:', err);
            return false;
        }
    },

    removeFromFavorites: async (contentId) => {
        try {
            await removeFavorite(contentId);
            const currentUser = get().user;
            if (!currentUser) return false;
            
            const newFavorites = (currentUser.favorites || []).filter(id => id !== contentId);
            set({ user: { ...currentUser, favorites: newFavorites } });
            return true;
        } catch (err) {
            console.error('Remove favorite failed:', err);
            return false;
        }
    },

    isFavorite: (contentId) => {
        const user = get().user;
        return user?.favorites?.includes(contentId) || false;
    },
}));

export default useAuthStore;