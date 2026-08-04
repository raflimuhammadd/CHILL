import { useState, useEffect } from 'react';
import { FavoritesContext } from './FavoritesContext';
import filmData from '../data/filmData';
import { storage } from '../utils/localStorage';

const STORAGE_KEY = 'chill-streams-favorites';
const STORAGE_KEY_OVERRIDES = 'chill-streams-favorites-overrides';

export function FavoritesProvider({children}) {
    // initialize localstorage
    const [favorites, setFavorites] = useState(() => {
        const stored = storage.get(STORAGE_KEY, []);
        console.log('stored', stored);
        return stored;
    });

    const [favoriteOverrides, setFavoriteOverrides] = useState(() => {
        const stored = storage.get(STORAGE_KEY_OVERRIDES, {});
        console.log('stored overrides', stored);
        return stored;
    });

    // sync to localstorage whenever changes
    useEffect(() => {
        storage.set(STORAGE_KEY, favorites);
        console.log('favorites', favorites);
    }, [favorites]);

    useEffect(() => {
        storage.set(STORAGE_KEY_OVERRIDES, favoriteOverrides);
        console.log('favoriteOverrides', favoriteOverrides);
    }, [favoriteOverrides]);

    const addToFavorites = (id) => {
        setFavorites(prev => {
            if (prev.includes(id)) {
                console.log('already in favorites', id);
                return prev;
            }
            console.log('added to favorites', id);
            return [...prev, id];
        });
    };

    // remove from favorites
    const removeFromFavorites = (id) => {
        setFavorites(prev => {
            const filtered = prev.filter(favId => favId !== id);
            console.log('removed from favorites', id);
            return filtered;
        });
    };

    // check if in favorites
    const isFavorite = (id) => {
        return favorites.includes(id);
    };

    const getMergedFilm = (id) => {
        const filmKey = Object.keys(filmData).find(
            key => filmData[key].id === id
        );
        if (!filmKey) {
            console.warn(`No film found with id: ${id}`);
            return null;
        }
        const baseFilm = filmData[filmKey];
        const override = favoriteOverrides[id];

        return override ? {...baseFilm, ...override} : baseFilm;
    }

    const updateFavoriteItem = (id, updates) => {
        setFavoriteOverrides(prev => ({
            ...prev,
            [id]: {
                ...(prev[id] || {}),
                ...updates
            }
        }));
        console.log('updated favorite item', id, updates);
    }

    // get film objects
    const getFavoriteItems = () => {

        const items = favorites
            .map(id => getMergedFilm(id))
            .filter(Boolean);

        console.log('items', items.length);
        return items;



        // const items = favorites
        //     .map(id => {
        //         // find film by id in object
        //         const filmKey = Object.keys(filmData).find(
        //             key => filmData[key].id === id
        //         );

        //         if (!filmKey) {
        //             console.warn(`No film found with id: ${id}`);
        //             return null;
        //         }

        //         return filmData[filmKey];
        //     })
        //     .filter(Boolean);

        //     console.log('items', items.length);
        //     return items;
    };

    // clear all favorites
    const clearFavorites = () => {
        setFavorites([]);
        console.log('favorites cleared');
    };

    const value = {
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        getFavoriteItems,
        clearFavorites,
        updateFavoriteItem,
        getMergedFilm,
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    )
    
}