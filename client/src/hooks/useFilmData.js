import { useState, useEffect } from 'react';
import { contentService } from '../services/contentService';

export const useFilmData = () => {
    const [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        const fetchAllFilms = async () => {
            try {
                setLoading(true);
                setError(null);

                const result = await contentService.getAllContents();

                if (!cancelled) {
                    setFilms(result?.data?.contents || []);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchAllFilms();

        return () => {
            cancelled = true;
        };
    }, []);

    return {
        films,
        loading,
        error,
    };
};