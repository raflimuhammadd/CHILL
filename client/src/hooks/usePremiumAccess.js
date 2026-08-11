import { useMemo } from 'react';
import useAuthStore from '../features/auth/store/authStore';

export const usePremiumAccess = (films) => {
    const { user } = useAuthStore();
    const isPremiumUser = Boolean(user?.isPremium);

    const decoratedFilms = useMemo(() => {
        if (!Array.isArray(films) || films.length === 0) return [];

        return films.map((film) => ({
            ...film,
            isBlocked: Boolean(film.isPremium && !isPremiumUser),
            blockReason:
                film.isPremium && !isPremiumUser ? 'premium_required' : null,
        }));
    }, [films, isPremiumUser]);

    return {
        isPremiumUser,
        decoratedFilms,
    };
};