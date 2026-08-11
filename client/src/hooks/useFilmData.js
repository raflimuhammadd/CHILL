import { useState, useEffect } from 'react';
import { contentService } from '../services/contentService';

export const useFilmData = ({type} = {}) => {
    const [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        const fetchAllFilms = async () => {
            try {
                setLoading(true);
                setError(null);

                const params = {limit: 100};
                if (type) params.type = type;
                const result = await contentService.getAllContents(params);

                if (!cancelled) {
                    setFilms(result?.data?.contents || []);
                }
            } catch (err) {
                if (!cancelled) setError(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchAllFilms();

        return () => {
            cancelled = true;
        };
    }, [type]);

    return {
        films,
        loading,
        error,
    };
};