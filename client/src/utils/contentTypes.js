export const isSeries = (item) => {
    return item.episodes && item.episodes.includes('Episode');
};

export const isFilm = (item) => {
    return item.duration !== undefined;
};

export const getContentType = (item) => 
    isSeries(item) ? 'series' : isFilm(item) ? 'film' : 'unknown';