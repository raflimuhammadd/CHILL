import { create } from "zustand";
import useAuthStore from "../../auth/store/authStore";

const useFavoritesStore = create((set, get) => ({
    favoriteOverrides: {},

    addToFavorites: async (id) => {
        const success = await useAuthStore.getState().addToFavorites(id);
        return success;
    },

    removeFromFavorites: async (id) => {
        const success = await useAuthStore.getState().removeFromFavorites(id);
        return success;
    },

    clearFavorites: async () => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        
        const favorites = user.favorites || [];
        for (const contentId of favorites) {
            await useAuthStore.getState().removeFromFavorites(contentId);
        }
    },

    updateFavoriteItem: (id, updates) => {
        const { favoriteOverrides } = get();
        const newOverrides = {
            ...favoriteOverrides,
            [id]: { ...favoriteOverrides[id], ...updates }
        };
        set({ favoriteOverrides: newOverrides });
    },

    isFavorite: (id) => {
        return useAuthStore.getState().isFavorite(id);
    },

    getFavorites: () => {
        const user = useAuthStore.getState().user;
        return user?.favorites || [];
    },

    getFavoriteItems: (allFilms = []) => {
        const favorites = get().getFavorites();
        const { favoriteOverrides } = get();
        
        return favorites
            .map(id => {
                const film = allFilms.find(f => f.id === id);
                if (!film) return null;
                const override = favoriteOverrides[id] || {};
                return {...film, ...override};
            })
            .filter(Boolean);
    }
}))

export default useFavoritesStore