import {useState, useEffect, useMemo} from 'react';
import {useSearchParams} from 'react-router-dom';
import {contentService} from '../services/contentService';
import {useDebouncedValue} from './useDebouncedValue';

export const useSearchContent = () => {
    const [searchParams] = useSearchParams();
    const [contents, setContents] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const query = searchParams.get('q') || '';
    const debouncedQuery = useDebouncedValue(query, 400);

    const filters = useMemo(
        () => ({
            type: searchParams.get('type') || '',
            genre: searchParams.get('genre') || '',
            year: searchParams.get('year') || '',
            premium: searchParams.get('premium') || '',
            sort: searchParams.get('sort') || '',
        }),
        [searchParams]
    );

    const hasQuery = debouncedQuery.trim() !== '';
    const hasFilter =
        !!filters.type ||
        !!filters.genre ||
        !!filters.year ||
        !!filters.premium ||
        !!filters.sort;

    useEffect(() => {
        let cancelled = false;

        if (!hasQuery && !hasFilter) {
            if (!cancelled) {
                setContents([]);
                setTotal(0);
                setError(null);
            }
            return;
        }

        const params = {
            q: hasQuery ? debouncedQuery : undefined,
            type: filters.type || undefined,
            genre: filters.genre || undefined,
            year: filters.year ? Number(filters.year) : undefined,
            premium: filters.premium || undefined,
            sort: filters.sort || undefined,
        };

        const fetchResults = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await contentService.searchContents(params);

                if (!cancelled) {
                    const data = result?.data;
                    setContents(data?.contents || []);
                    setTotal(data?.total ?? 0);
                }
            } catch (err) {
                if (!cancelled) setError(err);
                if (!cancelled) setContents([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchResults();

        return () => {
            cancelled = true;
        }
    }, [debouncedQuery, filters, hasQuery, hasFilter]);

    return {contents, total, loading, error, searchParams};
}