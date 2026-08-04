import { create } from "zustand";
import filmData from "../../../data/filmData";

const useFavoritesStore = create((set, get) => ({
    // state
    favorites: JSON.parse(localStorage.getItem('chill-favorites')) || [],
    favoriteOverrides: JSON.parse(localStorage.getItem('chill-overrides')) 
    || {},

    // actions create
    addToFavorites: (id) => {
        const {favorites} = get();
        if (!favorites.includes(id)) {
            const newFavorites = [...favorites, id];
            localStorage.setItem('chill-favorites', JSON.stringify(newFavorites));
            set({favorites: newFavorites});
        }
    },
    removeFromFavorites: (id) => {
        const newFavorites = get().favorites.filter(favId => favId !== id);
        localStorage.setItem('chill-favorites', JSON.stringify(newFavorites));
        set({favorites: newFavorites});
    },
    clearFavorites: () => {
        localStorage.removeItem('chill-favorites');
        set({favorites: []});
    },
    updateFavoriteItem: (id, updates) => {
    const { favoriteOverrides } = get();
    const newOverrides = {
        ...favoriteOverrides,
        [id]: { ...favoriteOverrides[id], ...updates }
    };
        localStorage.setItem('chill-overrides', JSON.stringify(newOverrides));
        set({ favoriteOverrides: newOverrides });
    },
    isFavorite: (id) => get().favorites.includes(id),



    getFavoriteItems: () => {
        const {favorites, favoriteOverrides} = get();
        return favorites
            .map(id => {
                const film = Object.values(filmData).find(f => f.id === id);
                if (!film) return null;
                const override = favoriteOverrides[id] || {};
                return {...film, ...override};
            })
    }

    // getFavoriteItems: () => {
    //     const {favorites, favoriteOverrides} = get();
    //     return favorites
    //         .map(id => {
    //             const film = [id];
    //             if (!film) return null;
    //             const override = favoriteOverrides[id] || {};
    //             return {...film, ...override};
    //         })
    //         .filter(Boolean);
    // },
}))

export default useFavoritesStore